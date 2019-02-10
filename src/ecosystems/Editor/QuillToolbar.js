import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Text, TextInput, Animated, TouchableOpacity, Image } from "react-native";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { connect } from "react-redux";
import _ from "underscore";
import { QuillToolbarButton } from "./QuillToolbarButton";
import { QuillToolbarSeparator } from "./QuillToolbarSeparator";
import { MentionRow } from "./MentionRow";
import { UploadedImage } from "./UploadedImage";
import { setFocus, setButtonState, openLinkModal, openImagePicker, insertMentionSymbol } from "../../redux/actions/editor";
import * as Animatable from "react-native-animatable";

import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import icons from "../../icons";
import styles, { styleVars } from "../../styles";

const TOOLBAR_HEIGHT = 44;

class QuillToolbar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showToolbar: true,
			showImageToolbar: false,
			showMentionToolbar: false,
			overrideMentionBar: false
		};

		this._formattingHandlers = {};
		this.openLinkModal = this.openLinkModal.bind(this);
		this.openImagePicker = this.openImagePicker.bind(this);
		this.toggleFormatting = this.toggleFormatting.bind(this);
		this.showImageToolbar = this.showImageToolbar.bind(this);
		this.hideImageToolbar = this.hideImageToolbar.bind(this);
		this.insertMention = this.insertMention.bind(this);
		this.closeMentionBar = this.closeMentionBar.bind(this);
	}

	async componentDidUpdate(prevProps, prevState) {
		// Check if we need to show the mention bar
		if( !prevProps.editor.mentions.active && this.props.editor.mentions.active ){
			this.setState({
				showMentionToolbar: true,
				overrideMentionBar: false
			}, () => {
				this._wrapper.transitionTo({ height: 130 });
				this._toolbar.transitionTo({ opacity: 0 });
				this._mentionToolbar.transitionTo({ opacity: 1 });
			})
		}

		// Check if we need to hide the mention bar
		if( this.state.showMentionToolbar && ( ( !this.props.editor.mentions.active && prevProps.editor.mentions.active ) || ( !prevState.overrideMentionBar && this.state.overrideMentionBar ) ) ){
			this._wrapper.transitionTo({ height: TOOLBAR_HEIGHT });
			this._toolbar.transitionTo({ opacity: 1 });
			await this._mentionToolbar.transitionTo({ opacity: 0 });
			
			this.setState({
				showMentionToolbar: false,
				overrideMentionBar: false
			});
		}
	}

	/**
	 * Event handler that dispatches actions when formatting buttons are tapped
	 *
	 * @param 	string 			button 		Button tapped
	 * @param 	string|null		option 		Some buttons (e.g. lists) use option values instead of booleans
	 * @return 	void
	 */
	toggleFormatting(button, option = null) {
		let state = false;

		// Some buttons e.g. list have options, in which case we want to reverse
		// the state of the option, not the button
		if (!_.isBoolean(this.props.editor.formatting[button])) {
			state = !this.props.editor.formatting[button][option];
		} else {
			state = !this.props.editor.formatting[button];
		}

		this.props.dispatch(
			setButtonState({
				button,
				option,
				state
			})
		);
	}

	showImageToolbar() {
		this.setState(
			{
				showImageToolbar: true
			},
			() => {
				this._wrapper.transitionTo({ height: 75 });
				this._toolbar.transitionTo({ opacity: 0 });
			}
		);
	}

	async hideImageToolbar() {
		this._wrapper.transitionTo({ height: TOOLBAR_HEIGHT });
		this._toolbar.transitionTo({ opacity: 1 });
		await this._imageToolbar.transitionTo({ opacity: 0 }, null);

		this.setState({
			showImageToolbar: false
		});
	}

	/**
	 * Dispatch action to open the link modal in the editor
	 *
	 * @return 	void
	 */
	openLinkModal() {
		this.props.dispatch(openLinkModal());
	}

	/**
	 * Dispatch action to open the image picker in the editor
	 *
	 * @return 	void
	 */
	openImagePicker() {
		this.props.dispatch(openImagePicker());
	}

	/**
	 * Dispatch action to open the mention modal
	 *
	 * @return 	void
	 */
	insertMention() {
		this.props.dispatch(insertMentionSymbol());
	}

	/**
	 * The user has manually hidden the mention bar
	 *
	 * @return 	void
	 */
	closeMentionBar() {
		this.setState({
			overrideMentionBar: true
		});
	}

	/**
	 * Memoization function that returns a formatting handler
	 *
	 * @return 	void
	 */
	getFormattingHandler(button, option = null) {
		if (_.isUndefined(this._formattingHandlers[button])) {
			this._formattingHandlers = () => this.toggleFormatting(button, option);
		}

		return this._formattingHandlers[button];
	}

	render() {
		const attachedImages = this.props.editor.attachedImages.slice(0); // clone

		return (
			<KeyboardAccessoryView hideBorder alwaysVisible={this.props.editor.focused} visibleOpacity={this.props.editor.focused ? 1 : 0}>
				<View style={componentStyles.toolbarOuter}>
					<Animatable.View style={[componentStyles.toolbarInner]} ref={ref => (this._wrapper = ref)}>
						{Boolean(this.state.showToolbar) && (
							<Animatable.View style={[styles.flexRow, styles.flexAlignCenter, componentStyles.toolbarIcons]} ref={ref => (this._toolbar = ref)}>
								<QuillToolbarButton icon={require("../../../resources/image.png")} onPress={this.showImageToolbar} />
								<QuillToolbarButton
									active={this.props.editor.linkModalActive}
									icon={require("../../../resources/link.png")}
									onPress={this.openLinkModal}
								/>
								<QuillToolbarButton
									active={this.props.editor.mentionModalActive}
									icon={require("../../../resources/mention.png")}
									onPress={this.insertMention}
								/>
								<QuillToolbarSeparator />
								<QuillToolbarButton
									active={this.props.editor.formatting.bold}
									icon={require("../../../resources/bold.png")}
									onPress={this.getFormattingHandler("bold")}
								/>
								<QuillToolbarButton
									active={this.props.editor.formatting.italic}
									icon={require("../../../resources/italic.png")}
									onPress={this.getFormattingHandler("italic")}
								/>
								<QuillToolbarButton
									active={this.props.editor.formatting.underline}
									icon={require("../../../resources/underline.png")}
									onPress={this.getFormattingHandler("underline")}
								/>
								<QuillToolbarButton
									active={this.props.editor.formatting.list.bullet}
									icon={require("../../../resources/list_unordered.png")}
									onPress={this.getFormattingHandler("list", "bullet")}
								/>
								<QuillToolbarButton
									active={this.props.editor.formatting.list.ordered}
									icon={require("../../../resources/list_ordered.png")}
									onPress={this.getFormattingHandler("list", "ordered")}
								/>
							</Animatable.View>
						)}
						{Boolean(this.state.showMentionToolbar) && (
							<Animatable.View
								style={[styles.flex, componentStyles.mentionToolbar]}
								ref={ref => (this._mentionToolbar = ref)}
							>
								<ScrollView style={[styles.ptVeryTight]}>
									<View style={componentStyles.mentionContainer}>
										{Boolean(this.props.editor.mentions.loading) && !Boolean(this.props.editor.mentions.matches.length) && (
											<PlaceholderRepeater repeat={6}>
												<MentionRow loading />
											</PlaceholderRepeater>
										)}
										{!Boolean(this.props.editor.mentions.loading) && !Boolean(this.props.editor.mentions.matches.length) && (
											<Text style={[styles.mvTight, styles.mhStandard, styles.veryLightText]}>{Lang.get('no_matching_members')}</Text>
										)}
										{Boolean(this.props.editor.mentions.matches.length) && this.props.editor.mentions.matches.map(mention => (
											<MentionRow key={mention.id} onPress={mention.handler} name={mention.name} id={mention.id} photo={mention.photo} />
										))}
									</View>
									<TouchableOpacity onPress={this.closeMentionBar} style={componentStyles.closeMentionBar}>
										<Image source={icons.CROSS} resizeMode='contain' style={componentStyles.closeMentionBarIcon} />
									</TouchableOpacity>
								</ScrollView>
							</Animatable.View>
						)}
						{Boolean(this.state.showImageToolbar) && (
							<Animatable.View
								style={[styles.flexRow, styles.pvTight, styles.plTight, componentStyles.imageToolbar]}
								ref={ref => (this._imageToolbar = ref)}
							>
								<ScrollView horizontal style={[styles.flexRow, styles.flexGrow]}>
									<TouchableOpacity
										onPress={this.openImagePicker}
										style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyCenter, styles.mrStandard, componentStyles.addImage]}
									>
										<Image source={icons.PLUS_CIRCLE} resizeMode="contain" style={componentStyles.addImageIcon} />
									</TouchableOpacity>
									{attachedImages.reverse().map(image => (
										<UploadedImage image={image.uri} status={image.status} key={image.uri} />
									))}
								</ScrollView>
								<TouchableOpacity onPress={this.hideImageToolbar} style={[styles.pvTight, componentStyles.closeImageToolbar]}>
									<View style={[styles.flex, styles.flexJustifyCenter, styles.phTight, componentStyles.closeImageToolbarInner]}>
										<Image source={icons.CROSS} resizeMode="contain" style={componentStyles.closeIcon} />
									</View>
								</TouchableOpacity>
							</Animatable.View>
						)}
					</Animatable.View>
				</View>
			</KeyboardAccessoryView>
		);
	}
}

export default connect(state => ({
	editor: state.editor
}))(QuillToolbar);

const componentStyles = StyleSheet.create({
	toolbarOuter: {
		backgroundColor: "rgba(255,255,255,0.8)",
		borderTopWidth: 1,
		borderTopColor: styleVars.borderColors.medium
	},
	toolbarInner: {
		height: TOOLBAR_HEIGHT
	},
	toolbarIcons: {
		...StyleSheet.absoluteFillObject,
		opacity: 1
	},
	imageToolbar: {
		...StyleSheet.absoluteFillObject,
		opacity: 0
	},
	mentionToolbar: {
		...StyleSheet.absoluteFillObject,
		opacity: 0
	},
	addImage: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: styleVars.greys.medium,
		width: 60,
		height: 60,
		borderRadius: 6
	},
	addImageIcon: {
		width: 20,
		height: 20,
		tintColor: styleVars.greys.placeholder
	},
	closeImageToolbarInner: {
		borderLeftWidth: 1,
		borderLeftColor: styleVars.greys.medium
	},
	closeIcon: {
		width: 20,
		height: 20,
		tintColor: styleVars.greys.placeholder
	},
	mentionContainer: {
		marginRight: 36
	},
	closeMentionBar: {
		position: 'absolute',
		right: 8,
		top: 8
	},
	closeMentionBarIcon: {
		width: 20,
		height: 20,
		tintColor: styleVars.greys.placeholder
	}
});
