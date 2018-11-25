import React, { Component } from "react";
import { Text, ScrollView, FlatList, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";
import { transparentize } from "polished";
import Fuse from "fuse.js";

import Lang from "../../utils/Lang";
import Button from "../../atoms/Button";
import Tag from "../../atoms/Tag";
import CheckListRow from "../../atoms/CheckListRow";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

class TagEdit extends Component {
	constructor(props) {
		super(props);
		this._predefinedTagHandlers = {};
		this._suggestedTagHandlers = {};
		this._removeTagHandlers = {};
		this._tagInput = null;
		this._search = null;

		this.state = {
			modalVisible: false,
			currentTags: [],
			storedTags: [],
			searchText: ""
		};

		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.submitTags = this.submitTags.bind(this);
		this.addTag = this.addTag.bind(this);

		this._searchOptions = {
			shouldSort: true,
			threshold: 0.4,
			keys: [ 'tag' ]
		};
	}

	/**
	 * Shows the tag edit modal
	 *
	 * @return 	void
	 */
	showModal() {
		console.log("Tag press");
		this.setState({
			modalVisible: true
		});
	}

	/**
	 * Hides the tag edit modal
	 *
	 * @return 	void
	 */
	hideModal() {
		this.setState({
			modalVisible: false
		});
	}

	/**
	 * Event handler for tapping Save on the tag modal to commit the tags to the form
	 *
	 * @return 	void
	 */
	submitTags() {
		this.setState({
			modalVisible: false,
			storedTags: [...this.state.currentTags]
		});
	}

	/**
	 * Returns a component that details the tag requirements set by the site
	 *
	 * @return 	Component|null
	 */
	getTagRequirements() {
		const settings = this.props.site.settings;

		if (!settings.tags_min && !settings.tags_max && !settings.tags_len_min && !settings.tags_len_max) {
			return null;
		}

		let tagCountMessage;
		if (settings.tags_min && settings.tags_max) {
			tagCountMessage = Lang.pluralize(Lang.get("tags_min_max", { min: settings.tags_min }), settings.tags_max);
		} else if (settings.tags_min) {
			tagCountMessage = Lang.pluralize(Lang.get("tags_min"), settings.tags_min);
		} else if (settings.tags_max) {
			tagCountMessage = Lang.pluralize(Lang.get("tags_max"), settings.tags_max);
		}

		let tagLenMessage;
		if (settings.tags_len_min && settings.tags_len_max && settings.tags_open_system) {
			tagLenMessage = Lang.pluralize(Lang.get("tags_len_min_max", { min: settings.tags_len_min }), settings.tags_len_max);
		} else if (settings.tags_len_min) {
			tagLenMessage = Lang.pluralize(Lang.get("tags_len_min"), settings.tags_len_min);
		} else if (settings.tags_len_max) {
			tagLenMessage = Lang.pluralize(Lang.get("tags_len_max"), settings.tags_len_max);
		}

		return (
			<View style={[componentStyles.tagRequirements, styles.mhWide, styles.pvStandard]}>
				{tagCountMessage && <Text style={[styles.veryLightText, styles.smallText, styles.centerText]}>{tagCountMessage}</Text>}
				{tagLenMessage && <Text style={[styles.veryLightText, styles.smallText, styles.centerText]}>{tagLenMessage}</Text>}
			</View>
		);
	}

	/**
	 * Memoization function for predefined tag onPress handlers, defining, storing and returning
	 * an onPress handler for each tag
	 *
	 * @param 	string 		tag 	The tag we're working with
	 * @return 	function
	 */
	getPredefinedTagOnPress(tag) {
		if (_.isUndefined(this._predefinedTagHandlers[tag])) {
			this._predefinedTagHandlers[tag] = () => this.predefinedTagOnPress(tag);
		}

		return this._predefinedTagHandlers[tag];
	}

	/**
	 * Event handler for tapping a predefined tag in the list
	 *
	 * @param 	string 		tag 	The tag we're working with
	 * @return 	void
	 */
	predefinedTagOnPress(tag) {
		const settings = this.props.site.settings;
		// Important: clone currentTags since we can't mutate the existing state
		let newTags = [...this.state.currentTags];

		if (this.state.currentTags.indexOf(tag) === -1) {
			newTags.push(tag);

			if (settings.tags_max && newTags.length > settings.tags_max) {
				newTags.shift(); // remove the first item
			}
		} else {
			newTags = _.without(newTags, tag);
		}

		this.setState({
			currentTags: newTags
		});
	}

	/**
	 * Memoization function for removeTagOnPress
	 *
	 * @param 	string 		tag 	The tag we're working with
	 * @return 	function
	 */
	getRemoveTagOnPress(tag) {
		if (_.isUndefined(this._removeTagHandlers[tag])) {
			this._removeTagHandlers[tag] = () => this.removeTagOnPress(tag);
		}

		return this._removeTagHandlers[tag];
	}

	/**
	 * Event handler for tapping X next to an entered tag to remove it
	 *
	 * @param 	string 		tag 	The tag we're working with
	 * @return 	void
	 */
	removeTagOnPress(tag) {
		const newTags = [...this.state.currentTags];

		this.setState({
			currentTags: _.without(newTags, tag)
		});
	}

	/**
	 * Event handler for typing in the tag text input
	 *
	 * @param 	string 		text 	The current value of the text field
	 * @return 	void
	 */
	onChangeText(text) {
		text = text.replace("#", "").trim();
		this.setState({ searchText: text });
	}

	/**
	 * Event handler for the Add button to add a custom tag
	 * Adds the tag to state and re-focuses the text input
	 *
	 * @return 	void
	 */
	addTag(tag) {
		// Important: clone currentTags since we can't mutate the existing state
		const updatedTags = [...this.state.currentTags];
		const newTag = !_.isUndefined(tag) ? tag : this.state.searchText;

		if (updatedTags.indexOf(newTag) === -1) {
			updatedTags.unshift(newTag);
		}

		this.setState(
			{
				currentTags: updatedTags,
				searchText: ""
			},
			() => {
				this._tagInput.focus();
			}
		);
	}

	/**
	 * Return the appropriate state of the Add button, depending on value of textinput
	 *
	 * @return 	boolean
	 */
	getAddButtonEnabledState() {
		const settings = this.props.site.settings;

		// Regardless of settings, disable if there's no text
		if (!this.state.searchText.length) {
			return true;
		}

		// If we have min/max set, check those
		if (
			(settings.tags_len_min && this.state.searchText.length < settings.tags_len_min) ||
			(settings.tags_len_max && this.state.searchText.length > settings.tags_len_max)
		) {
			return true;
		}

		return false;
	}

	/**
	 * Return boolean indicating whether the Save button in the modal should be enabled
	 * If we don't meet the requirements to save the tags (e.g. too few), disable this link
	 *
	 * @return 	boolean
	 */
	getSaveButtonEnabledState() {
		const settings = this.props.site.settings;

		if (!this.state.currentTags.length) {
			return false;
		}

		if (settings.tags_min) {
			if (this.state.currentTags.length < settings.tags_min) {
				if ((settings.tags_min_req && this.state.currentTags.length > 0) || !settings.tags_min_req) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Return the component structure when we're using closed tagging
	 *
	 * @return 	Component
	 */
	closedTaggingComponent() {
		return (
			<ScrollView style={styles.flex} keyboardShouldPersistTaps='always'>
				{this.props.definedTags.map(tag => {
					const checked = this.state.currentTags.indexOf(tag) !== -1;
					return (
						<CheckListRow
							key={tag}
							checked={checked}
							title={
								<View style={[styles.flexRow, styles.flexAlignStart]}>
									<Image
										source={checked ? icons.TAG_SOLID : icons.TAG}
										resizeMode="contain"
										style={[componentStyles.tagIcon, checked ? componentStyles.tagIconActive : null]}
									/>
									<Text style={[styles.mlTight, styles.contentText]}>{tag}</Text>
								</View>
							}
							onPress={this.getPredefinedTagOnPress(tag)}
						/>
					);
				})}
			</ScrollView>
		);
	}

	renderSuggestion(tag) {
		return (
			<TouchableHighlight onPress={this.getSuggestionOnPressHandler(tag)}>
				<View style={[styles.row, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyBetween, styles.pWide]}>
					<Text style={[styles.flex, styles.contentText, styles.text, styles.italicText]}>{tag}</Text>
					<Image source={icons.PLUS_CIRCLE} resizeMode="contain" style={[componentStyles.tagIcon, componentStyles.tagIconActive]} />
				</View>
			</TouchableHighlight>
		);
	}

	getSuggestionOnPressHandler(tag) {
		if( _.isUndefined( this._suggestedTagHandlers[tag] ) ){
			this._suggestedTagHandlers[tag] = () => this.suggestedTagOnPress(tag);
		}

		return this._suggestedTagHandlers[tag];
	}

	suggestedTagOnPress(tag) {
		this.addTag(tag);
	}

	/**
	 * Return the component structure when we're using open tagging
	 *
	 * @return 	Component
	 */
	openTaggingComponent() {
		let content;

		if (this.state.searchText.length > 0 && this.props.definedTags.length) {
			if( !this._search ){
				const tags = this.props.definedTags.map( tag => ({ tag }) );
				this._search = new Fuse(tags, this._searchOptions);
			}

			let results = this._search.search( this.state.searchText );
			results = results.slice(0, 5);

			if( results.length ){
				return (
					<ScrollView style={[styles.flex, styles.ptVeryWide]}  keyboardShouldPersistTaps='always'>
						<Text style={[styles.lightText, styles.phWide, styles.smallText]}>{Lang.get('tag_suggestions').toUpperCase()}</Text>
						<FlatList
							data={results}
							keyExtractor={item => item.tag}
							renderItem={({item}) => this.renderSuggestion(item.tag)}
							keyboardShouldPersistTaps='always'
						/>
					</ScrollView>
				);
			}
		} 

		return (
			<ScrollView style={styles.flex} keyboardShouldPersistTaps='always'>
				{this.state.currentTags.map(tag => (
					<View key={tag} style={[styles.row, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyBetween, styles.pWide]}>
						<View style={[styles.flexRow, styles.flexAlignStart]}>
							<Image source={icons.TAG} resizeMode="contain" style={[componentStyles.tagIcon, componentStyles.tagIconActive]} />
							<Text style={[styles.mlTight, styles.contentText, styles.flexGrow]}>{tag}</Text>
							<TouchableOpacity onPress={this.getRemoveTagOnPress(tag)} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
								<Image source={icons.CROSS} resizeMode="contain" style={[componentStyles.tagIcon, componentStyles.tagIconActive]} />
							</TouchableOpacity>
						</View>
					</View>
				))}
			</ScrollView>
		);
	}

	/**
	 * Return the main tag field that is shown on the create content form
	 * Shows a list of tags if we have some saved, or a placeholder otherwise
	 *
	 * @return 	Component
	 */
	getTagField() {
		if (!this.state.storedTags.length) {
			return (
				<TouchableWithoutFeedback style={styles.flex} onPress={this.showModal}>
					<View>
						<Text style={[styles.fieldText, styles.fieldTextPlaceholder]}>{Lang.get('tags')}</Text>
					</View>
				</TouchableWithoutFeedback>
			);
		}

		return (
			<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyStart]}>
				{this.state.storedTags.map(tag => (
					<Tag key={tag} style={componentStyles.tag}>
						{tag}
					</Tag>
				))}
			</View>
		);
	}

	render() {
		return (
			<View style={[styles.field, styles.pvStandard, componentStyles.outerWrap]}>
				<View style={[componentStyles.innerWrap, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyBetween]}>
					{this.getTagField()}
					<TouchableOpacity onPress={this.showModal}>
						<Image source={icons.PENCIL} style={componentStyles.plus} />
					</TouchableOpacity>
				</View>
				<Modal
					style={styles.modalAlignBottom}
					avoidKeyboard={true}
					animationIn="slideInUp"
					isVisible={this.state.modalVisible}
					onBackdropPress={this.hideModal}
				>
					<View style={[styles.modalInner, componentStyles.modalInner]}>
						<View style={styles.modalHeader}>
							<View style={styles.modalHeaderBar}>
								<TouchableOpacity onPress={this.hideModal}>
									<Text style={styles.modalHeaderLink}>{Lang.get("cancel")}</Text>
								</TouchableOpacity>
								<Text style={styles.modalTitle}>{Lang.get('manage_tags')}</Text>
								<TouchableOpacity onPress={this.submitTags} disabled={!this.getSaveButtonEnabledState()}>
									<Text style={[styles.modalHeaderLink, !this.getSaveButtonEnabledState() ? styles.modalHeaderLinkDisabled : null]}>
										{Lang.get("save")}
									</Text>
								</TouchableOpacity>
							</View>
							<View style={[componentStyles.searchBarWrap, styles.flexRow, styles.phStandard, styles.ptStandard, styles.mtWide]}>
								<View
									style={[
										componentStyles.searchInput,
										styles.pTight,
										styles.flexRow,
										styles.flexAlignCenter,
										styles.flexGrow,
										styles.flexBasisZero,
										styles.mrStandard
									]}
								>
									<TextInput
										ref={ref => (this._tagInput = ref)}
										style={[styles.flexGrow, styles.contentText]}
										onChangeText={text => this.onChangeText(text)}
										value={this.state.searchText}
										placeholder={Lang.get('enter_tag')}
										autoCorrect={false}
										autoCapitalize="none"
										spellCheck={false}
										textContentType="none"
										onSubmitEditing={this.addTag}
									/>
								</View>
								<Button size="medium" type="primary" filled title={Lang.get('add')} disabled={this.getAddButtonEnabledState()} onPress={this.addTag} />
							</View>
						</View>
						<View style={[styles.flex, componentStyles.mainBody]}>
							{this.props.site.settings.tags_open_system ? this.openTaggingComponent() : this.closedTaggingComponent()}
							{this.props.site.settings.tags_min || this.props.site.settings.tags_max ? this.getTagRequirements() : null}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export default compose(
	connect(state => ({
		site: state.site
	}))
)(TagEdit);

const componentStyles = StyleSheet.create({
	innerWrap: {
		width: "100%"
	},
	plus: {
		tintColor: "#3370AA",
		width: 20,
		height: 20
	},
	mainBody: {
		backgroundColor: "#fff"
	},
	modalInner: {
		height: "80%"
	},
	tagIcon: {
		width: 18,
		height: 18,
		tintColor: styleVars.lightText
	},
	tagIconActive: {
		tintColor: styleVars.checkmarkColor
	},
	tagRequirements: {
		borderTopWidth: 1,
		borderTopColor: styleVars.greys.darker
	},
	searchBarWrap: {
		width: "100%",
		borderTopWidth: 1,
		borderTopColor: transparentize(0.2, styleVars.greys.darker)
	},
	searchInput: {
		backgroundColor: transparentize(0.2, styleVars.greys.darker),
		borderRadius: 3
	},
	searchBar: {},
	searchBarIcon: {
		width: 14,
		height: 14,
		tintColor: "rgba(0,0,0,0.6)"
	}
});
