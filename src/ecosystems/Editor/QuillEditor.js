import React, { Fragment, Component } from "react";
import { View, TextInput, Text, KeyboardAvoidingView, Button, WebView, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { ImagePicker, Permissions } from "expo";
import _ from "lodash";
import styles from "../../styles";
import { QuillToolbarButton } from "./QuillToolbarButton";
import { QuillToolbarSeparator } from "./QuillToolbarSeparator";
//import AdvancedWebView from 'react-native-advanced-webview';

const EDITOR_VIEW = require("../../../web/dist/index.html");
const MESSAGE_PREFIX = Expo.Constants.manifest.extra.message_prefix;
const util = require("util");

const formattingOptions = {
	bold: true,
	italic: true,
	underline: true,
	list: ["bullet", "ordered"],
	link: true
};

export default class QuillEditor extends Component {
	constructor(props) {
		super(props);
		this.webview = null;

		// Set up initial state for our formatting options. Format types with options are
		// created as camelCase keys in the state, e.g. listUnordered or listOrdered
		const formattingState = {};
		Object.entries(formattingOptions).forEach(pair => {
			if (_.isBoolean(pair[1])) {
				formattingState[pair[0]] = false;
			} else {
				for (let i = 0; i < pair[1].length; i++) {
					const stateKey = pair[0] + (pair[1][i].charAt(0).toUpperCase() + pair[1][i].slice(1));
					formattingState[stateKey] = false;
				}
			}
		});

		this.state = {
			debug: [],
			loading: true,
			focused: false,
			linkModal: {
				visible: false,
				url: "",
				text: ""
			},
			formatting: formattingState,
			content: ''
		};

		// Optionally set a height on the webview
		// We need this if we're showing the editor in a scrollview, 
		// which doesn't support flex elements
		this.inlineStyles = {};
		if( props.height ){
			this.inlineStyles = {
				height: props.height
			};
		}
	}

	componentDidMount() {}

	/**
	 * Component update
	 *
	 * @param 	prevProps
	 * @param 	prevState
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		// If we're now focused, but were not before, call the callback
		if( !prevState.focused && this.state.focused ){
			if( this.props.onFocus ){
				this.props.onFocus.call(null, this.measurer);
			}
		}
	}

	/**
	 * Handle messages sent from the WebView
	 *
	 * @param 	event 	e
	 * @return 	void
	 */
	onMessage(e) {
		try {
			const messageData = JSON.parse(e.nativeEvent.data);
			const supported = [
				'READY', 
				'EDITOR_BLUR', 
				'FORMATTING', 
				'CONTENT'
			];

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				if( supported.indexOf(messageType) !== -1 && this[messageType] ){
					this[messageType].call(this, messageData);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * ========================================================================
	 * MESSAGE HANDLERS
	 * ========================================================================
	 */
	READY() {
		/*if( this.props.autoFocus ){
			setTimeout( () => {
				this.sendMessage("FOCUS");
			}, 500 );
		}*/
	}

	EDITOR_BLUR() {
		this.setState({
			focused: false
		});
	}

	FORMATTING(messageData) {
		this.setState({
			focused: true
		});

		this.setButtonState(messageData.formatState);
	}

	CONTENT(messageData){
		this.setState({
			content: messageData.content
		});

		this.props.update.call(null, messageData.content);
	}
	/**
	 * ========================================================================
	 * END MESSAGE HANDLERS
	 * ========================================================================
	 */

	/**
	 * Sets buttons to active/inactive, depending on the state object received from webview
	 *
	 * @param 	object 	buttonStates 	Button state object recieved from quill webview
	 * @return 	void
	 */
	setButtonState(buttonStates) {
		const newState = {};

		// Loop through each supported formatting option, and determine
		// whether the button should be set to active or not
		Object.entries(formattingOptions).forEach(pair => {
			if (_.isBoolean(pair[1])) {
				newState[pair[0]] = !_.isUndefined(buttonStates[pair[0]]);
			} else {
				for (let i = 0; i < pair[1].length; i++) {
					const stateKey = pair[0] + (pair[1][i].charAt(0).toUpperCase() + pair[1][i].slice(1));
					newState[stateKey] = !_.isUndefined(buttonStates[pair[0]]) && pair[1][i] == buttonStates[pair[0]];
				}
			}
		});

		this.setState(
			{
				formatting: {
					...this.state.formatting,
					...newState
				}
			}
		);
	}

	/**
	 * Event handler for basic formatting buttons
	 *
	 * @param 	string 	type 		The button type
	 * @param 	string 	option 		The option for this button, if applicable
	 * @return 	void
	 */
	toggleFormatting(type, option) {
		const stateKey = option ? type + (option.charAt(0).toUpperCase() + option.slice(1)) : type;
		const currentState = this.state.formatting[stateKey];

		this.sendMessage("SET_FORMAT", {
			type: type,
			option: !currentState && option ? option : !currentState
		});
		this.setState({
			formatting: {
				...this.state.formatting,
				[stateKey]: !this.state.formatting[stateKey]
			}
		});
	}

	/**
	 * Send a message to WebView
	 *
	 * @param 	string 	message 	The message type to send
	 * @param 	object 	data 		Any additional data to send with message
	 * @return 	void
	 */
	sendMessage(message, data) {
		if (!this.webview) {
			console.error("Webview not ready");
			return;
		}

		const messageToSend = JSON.stringify({
			message: `${MESSAGE_PREFIX}${message}`,
			...data
		});

		console.log(`Sending ${message} ${util.inspect(data)}`);
		this.webview.postMessage(messageToSend, "*");
	}

	/**
	 * Show the Insert Link modal
	 *
	 * @return 	void
	 */
	showLinkModal() {
		this.setState({
			linkModal: {
				visible: true,
				url: "",
				text: ""
			},
			focused: false // Set editor focus to hide the toolbar
		});
	}

	/**
	 * Hide the Insert Link modal
	 *
	 * @return 	void
	 */
	hideLinkModal() {
		this.setState({
			linkModal: {
				visible: false,
				url: "",
				text: ""
			},
			focused: true
		});
	}

	/**
	 * Event handler for submitting the Insert Link modal, to send the link to quill WebView
	 *
	 * @return 	void
	 */
	insertLink() {
		this.setState({
			linkModal: {
				visible: false
			}
		});

		this.sendMessage("FOCUS");
		this.sendMessage("INSERT_LINK", {
			url: this.state.linkModal.url,
			text: this.state.linkModal.text
		});

		console.log("Insert:", this.state.linkModal.url, this.state.linkModal.text);
	}

	/**
	 * Event handler for image button; show the OS image picker
	 *
	 * @return 	void
	 */
	async showImagePicker() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if( status === 'granted' ){
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3]
			});

			console.log(result);

			if (result.cancelled) {
				return;
			}
		} else {
			throw new Error("Permission not granted");
		}
	}

	render() {
		const placeholder = this.props.placeholder ? `"${this.props.placeholder}"` : `null`;
		const injectedJavaScript = `
			window._PLACEHOLDER = ${placeholder};
			window._readyToGo = true;
		`;

		return (
			<View style={{ flex: 1 }}>
				<Modal
					style={modalStyles.modal}
					avoidKeyboard={true}
					animationIn="bounceIn"
					isVisible={this.state.linkModal.visible}
					onBackdropPress={() => this.hideLinkModal()}
				>
					<View style={[styles.modal, styles.modalHorizontalPadding, modalStyles.modalInner]}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Insert Link</Text>
						</View>
						<TextInput
							onChangeText={url => this.setState({ linkModal: { ...this.state.linkModal, url } })}
							value={this.state.linkModal.url}
							style={styles.textInput}
							placeholder="Link URL"
						/>
						<TextInput
							onChangeText={text => this.setState({ linkModal: { ...this.state.linkModal, text } })}
							value={this.state.linkModal.text}
							style={styles.textInput}
							placeholder="Link text"
						/>
						<Button title="Insert link" onPress={() => this.insertLink()} />
					</View>
				</Modal>
				<View ref={measurer => (this.measurer = measurer)} style={{height: 1, backgroundColor: '#fff'}}></View>
				<WebView
					source={EDITOR_VIEW}
					onMessage={this.onMessage.bind(this)}
					ref={webview => (this.webview = webview)}
					javaScriptEnabled={true}
					injectedJavaScript={injectedJavaScript}
					mixedContentMode="always"
					scalesPageToFit={false}
					style={[editorStyles.editor, this.inlineStyles]}
					hideAccessory={true}
				/>
				{this.state.focused ? (
					<View style={[toolbarStyles.toolbarOuter]}>
						<View style={toolbarStyles.toolbarInner}>
							<QuillToolbarButton icon={require("../../../resources/image.png")} onPress={() => this.showImagePicker()} />
							<QuillToolbarButton
								active={this.state.linkModal.visible}
								icon={require("../../../resources/link.png")}
								onPress={() => this.showLinkModal()}
							/>
							<QuillToolbarSeparator />
							<QuillToolbarButton
								active={this.state.formatting.bold}
								icon={require("../../../resources/bold.png")}
								onPress={() => this.toggleFormatting("bold")}
							/>
							<QuillToolbarButton
								active={this.state.formatting.italic}
								icon={require("../../../resources/italic.png")}
								onPress={() => this.toggleFormatting("italic")}
							/>
							<QuillToolbarButton
								active={this.state.formatting.underline}
								icon={require("../../../resources/underline.png")}
								onPress={() => this.toggleFormatting("underline")}
							/>
							<QuillToolbarButton
								active={this.state.formatting.listBullet}
								icon={require("../../../resources/list_unordered.png")}
								onPress={() => this.toggleFormatting("list", "bullet")}
							/>
							<QuillToolbarButton
								active={this.state.formatting.listOrdered}
								icon={require("../../../resources/list_ordered.png")}
								onPress={() => this.toggleFormatting("list", "ordered")}
							/>
						</View>
					</View>
				) : null}
			</View>
		);
	}
}

const modalStyles = StyleSheet.create({
	modal: {
		flex: 1
	},
	modalInner: {}
});

const editorStyles = StyleSheet.create({
	editor: {
		flex: 1,
		borderBottomWidth: 0
	}
});

const toolbarStyles = StyleSheet.create({
	toolbarOuter: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 125,
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#c7c7c7",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start"
	},
	toolbarInner: {
		height: 44,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	}
});
