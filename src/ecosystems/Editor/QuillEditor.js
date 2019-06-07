import React, { Fragment, Component } from "react";
import { View, TextInput, Text, KeyboardAvoidingView, Button, WebView, StyleSheet, LayoutAnimation } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import Modal from "react-native-modal";
import { ImagePicker, Permissions, FileSystem, ImageManipulator } from "expo";
import _ from "lodash";
import { connect } from "react-redux";
import {
	setFocus,
	setFormatting,
	resetEditor,
	resetImagePicker,
	resetCamera,
	addImageToUpload,
	showMentionBar,
	hideMentionBar,
	loadingMentions,
	updateMentionResults,
	insertMentionSymbolDone,
	uploadImage,
	setUploadStatus,
	UPLOAD_STATUS
} from "../../redux/actions/editor";
import styles, { styleVars } from "../../styles";

const EDITOR_VIEW = require("../../../web/dist/index.html");
const MESSAGE_PREFIX = Expo.Constants.manifest.extra.message_prefix;

const formattingOptions = {
	bold: true,
	italic: true,
	underline: true,
	list: ["bullet", "ordered"],
	link: true
};

const MentionQuery = gql`
	query MentionQuery($term: String) {
		core {
			search(term: $term, type: core_members, orderBy: name, limit: 10) {
				results {
					... on core_Member {
						id
						name
						photo
						url
					}
				}
			}
		}
	}
`;

class QuillEditor extends Component {
	constructor(props) {
		super(props);
		this.webview = null;
		this._mentionHandlers = {};

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
			linkModal: {
				visible: false,
				url: "",
				text: ""
			},
			formatting: formattingState,
			content: ""
		};

		// Optionally set a height on the webview
		// We need this if we're showing the editor in a scrollview,
		// which doesn't support flex elements
		this.inlineStyles = {};
		if (props.height) {
			this.inlineStyles = {
				height: props.height
			};
		}
	}

	/**
	 * When mounted we need to reset the editor state
	 * This is because we only maintain one global editor state
	 *
	 * @return 	void
	 */
	componentDidMount() {
		this.props.dispatch(resetEditor());
	}

	/**
	 * Component update
	 *
	 * @param 	prevProps
	 * @param 	prevState
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		// If we're now focused, but were not before, call the callback
		if (!prevProps.editor.focused && this.props.editor.focused) {
			if (this.props.onFocus) {
				this.props.onFocus.call(null, this.measurer);
			}
		}

		// Are we inserting the mention symbol?
		if (!prevProps.editor.mentions.insertSymbol && this.props.editor.mentions.insertSymbol) {
			this.insertMentionSymbol();
		}

		// Are we opening the link modal?
		if (!prevProps.editor.linkModalActive && this.props.editor.linkModalActive) {
			this.showLinkModal();
		}

		// Are we opening the image picker?
		if (!prevProps.editor.imagePickerOpened && this.props.editor.imagePickerOpened) {
			this.showImagePicker();
			this.props.dispatch(resetImagePicker());
		}

		// Are we opening the camera?
		if (!prevProps.editor.cameraOpened && this.props.editor.cameraOpened) {
			this.showCamera();
			this.props.dispatch(resetCamera());
		}

		// If any of our formatting options have changed, send a SET_FORMAT command to the WebView
		if (!_.isMatch(prevProps.editor.formatting, this.props.editor.formatting)) {
			Object.entries(this.props.editor.formatting).forEach(pair => {
				if (_.isObject(pair[1])) {
					// If this is a button with options, then loop through and find the option that
					// is currently active. If none are active, we'll send false to Quill.
					let activeOption = _.find(Object.keys(this.props.editor.formatting[pair[0]]), val => {
						return this.props.editor.formatting[pair[0]][val] === true;
					});

					this.sendMessage("SET_FORMAT", {
						type: pair[0],
						option: activeOption || false
					});
				} else {
					// If this is a simple boolean button, send it
					if (prevProps.editor.formatting[pair[0]] !== this.props.editor.formatting[pair[0]]) {
						this.sendMessage("SET_FORMAT", {
							type: pair[0],
							option: pair[1]
						});
					}
				}
			});
		}
	}

	/**
	 * Get mentions from the server
	 *
	 * @param 	string 	searchTerm 		string used to match users
	 * @return 	void
	 */
	async fetchMentions(searchTerm) {
		try {
			console.log(`Fetching mentions for ${searchTerm}`);
			this.props.dispatch(loadingMentions());

			let mentions = [];
			const { data } = await this.props.client.query({
				query: MentionQuery,
				variables: { term: searchTerm }
			});

			if (data.core.search.results.length) {
				mentions = data.core.search.results.map(mention => {
					return {
						...mention,
						handler: this.getMentionHandler(mention)
					};
				});
			}

			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			this.props.dispatch(updateMentionResults(mentions));
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Memoization function that returns a handler for tapping on a mention
	 *
	 * @param 	object 		mention 	Data for a particular mention
	 * @return 	function
	 */
	getMentionHandler(mention) {
		if (_.isUndefined(this._mentionHandlers[mention.id])) {
			this._mentionHandlers[mention.id] = () => this.onPressMention(mention);
		}

		return this._mentionHandlers[mention.id];
	}

	/**
	 * Handler for tapping on a mention
	 *
	 * @param 	object 		mention 		Mention data
	 * @return 	void
	 */
	onPressMention(mention) {
		this.sendMessage("INSERT_MENTION", {
			name: mention.name,
			id: mention.id,
			url: mention.url
		});

		this.props.dispatch(hideMentionBar());
	}

	/**
	 * Insert the mention
	 *
	 * @param 	object 		mention 		Mention data
	 * @return 	void
	 */
	insertMentionSymbol() {
		this.sendMessage("INSERT_MENTION_SYMBOL");
		this.props.dispatch(insertMentionSymbolDone());
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
			const supported = ["DEBUG", "READY", "EDITOR_BLUR", "EDITOR_STATUS"];

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				if (supported.indexOf(messageType) !== -1 && this[messageType]) {
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
		this.sendMessage("INSERT_STYLES", {
			style: this.buildCustomStyles()
		});

		if (this.props.autoFocus) {
			setTimeout(() => {
				this.sendMessage("FOCUS");
			}, 500);
		}
	}

	EDITOR_BLUR() {
		this.props.dispatch(
			setFocus({
				focused: false
			})
		);
	}

	EDITOR_STATUS(messageData) {
		for (let key in messageData) {
			const handler = `handle${key.charAt(0).toUpperCase()}${key.slice(1)}`;

			if (_.isFunction(this[handler])) {
				this[handler].call(this, messageData[key]);
			}
		}
	}

	DEBUG(messageData) {
		console.log(`WEBVIEW DEBUG: ${messageData.debugMessage}`);
	}

	/**
	 * ========================================================================
	 * EDITOR STATUS HANDLERS
	 * ========================================================================
	 */
	/**
	 * Highlight appropriate formatting buttons
	 *
	 * @param 	object 	data 		Formatting data from Quill
	 * @return 	void
	 */
	handleFormatting(data) {
		// Set editor focus
		this.props.dispatch(
			setFocus({
				focused: true
			})
		);

		// Update current selection formatting
		const formatState = data;
		const newFormatting = {};

		Object.entries(this.props.editor.formatting).forEach(pair => {
			if (_.isBoolean(pair[1])) {
				// Normal boolean button - if it's in the object received from quill, that formatting is currently applied
				newFormatting[pair[0]] = !_.isUndefined(formatState[pair[0]]);
			} else {
				// Buttons with options. If the button type is in the object received, set the current option to true
				newFormatting[pair[0]] = {};
				Object.entries(pair[1]).forEach(subPair => {
					newFormatting[pair[0]][subPair[0]] = !_.isUndefined(formatState[pair[0]]) && formatState[pair[0]] == subPair[0];
				});
			}
		});

		this.props.dispatch(setFormatting(newFormatting));
	}

	/**
	 * Handle showing Mention list
	 *
	 * @param 	object 	data 		Mention data
	 * @return 	void
	 */
	handleMention(data) {
		if (data === null) {
			if (this.props.editor.mentions.active) {
				this.props.dispatch(hideMentionBar());
			}
			return;
		} else {
			this.props.dispatch(showMentionBar());

			if (data.text !== this.props.editor.mentions.searchText) {
				this.fetchMentions(data.text);
			}
		}
	}

	/**
	 * Handle receivig editor content, which we store in state so we can use it
	 *
	 * @param 	string 	data 	The editor contents
	 * @return 	void
	 */
	handleContent(data) {
		this.setState({
			content: data
		});

		this.props.update.call(null, data);
	}

	/**
	 * ========================================================================
	 * / END EDITOR STATUS HANDLERS
	 * ========================================================================
	 */

	buildCustomStyles() {
		const style = `
			.ipsMention {
				background: ${styleVars.accentColor};
				color: ${styleVars.reverseText};
				font-size: 14px;
				margin-top: -2px;
				border-radius: 3px;
				padding-top: 2px;
				padding-bottom: 2px;
				vertical-align: middle;
			}
		`;

		return style;
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

		console.log(`Sending ${message}`);
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
			}
		});

		this.props.dispatch(
			setFocus({
				focused: false
			})
		);
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
			}
		});

		this.props.dispatch(
			setFocus({
				focused: true
			})
		);
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

		if (status !== "granted") {
			throw new Error("Permission not granted");
		}

		let selectedFile = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "Images",
			base64: true
		});

		if (selectedFile.cancelled) {
			return;
		}

		this.doUploadImage(selectedFile);
	}

	/**
	 * Event handler for image button; show the OS camera
	 *
	 * @return 	void
	 */
	async showCamera() {
		const { status: statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (statusRoll !== "granted") {
			throw new Error("Permission not granted");
		}

		const { status: statusCamera } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (statusCamera !== "granted") {
			throw new Error("Permission not granted");
		}

		let selectedFile = await ImagePicker.launchCameraAsync({
			base64: true
		});

		if (selectedFile.cancelled) {
			return;
		}

		this.doUploadImage(selectedFile);
	}

	/**
	 * Uploads a provided image resource
	 *
	 * @param 	object 		selectedFile 		Object containing resource info for an image
	 * @return 	void
	 */
	async doUploadImage(selectedFile) {
		const { dispatch } = this.props;
		const maxImageDim = Expo.Constants.manifest.extra.max_image_dim;
		const { allowedFileTypes, chunkingSupported, maxChunkSize } = this.props.editor.settings;
		//const maxChunkSize = 3000;

		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		// If width or height is > 1000, resize
		if (selectedFile.width > maxImageDim || selectedFile.height > maxImageDim) {
			selectedFile = await ImageManipulator.manipulateAsync(
				selectedFile.uri,
				[{ resize: selectedFile.width > maxImageDim ? { width: maxImageDim } : { height: maxImageDim } }],
				{
					compress: 0.7,
					format: "jpeg",
					base64: true
				}
			);
		}

		const fileName = selectedFile.uri.split("/").pop();
		const fileExt = fileName.split(".").pop();

		// Check the extension is permitted
		if (_.isArray(allowedFileTypes) && allowedFileTypes.indexOf(fileExt) === -1) {
			// OK so this type isn't allowed. What if we change it to a jpg or png?
			if (allowedFileTypes.indexOf("jpg") !== -1 || allowedFileTypes.indexOf("png") !== -1) {
				selectedFile = await ImageManipulator.manipulateAsync(selectedFile.uri, {
					format: allowedFileTypes.indexOf("jpg") !== -1 ? "jpeg" : "png",
					base64: true
				});
			} else {
				// Nope, not even that. wtf.
				Alert.alert("Error", "Sorry, you can't upload images of this type.", [{ text: "OK" }], { cancelable: false });
				return;
			}
		}

		// Build data object to pass into action
		const uploadData = {
			// We need to figure out the max allowed size of a chunk, allowing for the fact it'll be base64'd
			// which adds approx 33% to the size. The -3 is to allow for up to three padding characters that
			// base64 will add
			maxActualChunkSize: Math.floor((maxChunkSize / 4) * 3 - 3),
			maxChunkSize: maxChunkSize,
			fileData: selectedFile,
			postKey: this.props.editorID,
			chunkingSupported: chunkingSupported
		};

		// Get the file stream
		try {
			const fileBuffer = Buffer.from(selectedFile.base64, "base64");

			// Check we have space for it
			if (this.props.user.maxUploadSize !== null) {
				if (fileBuffer.length > parseInt(this.props.user.maxUploadSize) - this.getCurrentUploadSize()) {
					Alert.alert("Error", "You do not have enough space left to upload this image.", [{ text: "OK" }], { cancelable: false });
					return;
				}
			}

			dispatch(uploadImage({ base64file: selectedFile.base64, fileBuffer }, uploadData));
		} catch (err) {
			dispatch(
				setUploadStatus({
					id: selectedFile.uri,
					status: UPLOAD_STATUS.ERROR,
					error: "There was a problem uploading this image." + err
				})
			);
		}
	}

	/**
	 * Returns the currently-used upload allowance
	 *
	 * @return 	int 	Upload size currently used
	 */
	getCurrentUploadSize() {
		const attachedImages = this.props.editor.attachedImages;
		const totalUploadSize = Object.keys(attachedImages).reduce((previous, current) => {
			// Don't count errored/aborted files in the total size calc
			if ([UPLOAD_STATUS.ERROR, UPLOAD_STATUS.ABORTED].indexOf(attachedImages[current].status) !== -1) {
				return previous;
			}
			return previous + attachedImages[current].fileSize;
		}, 0);

		return totalUploadSize;
	}

	render() {
		const placeholder = this.props.placeholder ? `"${this.props.placeholder}"` : `null`;
		const injectedJavaScript = `
			window._PLACEHOLDER = ${placeholder};
			window._readyToGo = true;
		`;

		return (
			<View style={{ flex: 1, backgroundColor: "#fff" }}>
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
							onChangeText={url =>
								this.setState({
									linkModal: { ...this.state.linkModal, url }
								})
							}
							value={this.state.linkModal.url}
							style={styles.textInput}
							placeholder="Link URL"
						/>
						<TextInput
							onChangeText={text =>
								this.setState({
									linkModal: { ...this.state.linkModal, text }
								})
							}
							value={this.state.linkModal.text}
							style={styles.textInput}
							placeholder="Link text"
						/>
						<Button title="Insert link" onPress={() => this.insertLink()} />
					</View>
				</Modal>
				<View ref={measurer => (this.measurer = measurer)} style={{ height: 1, backgroundColor: "#fff" }} />
				<WebView
					source={EDITOR_VIEW}
					onMessage={this.onMessage.bind(this)}
					ref={webview => (this.webview = webview)}
					javaScriptEnabled={true}
					injectedJavaScript={injectedJavaScript}
					mixedContentMode="always"
					style={[editorStyles.editor, this.inlineStyles]}
					hideAccessory={true}
					useWebKit={true}
				/>
			</View>
		);
	}
}

export default compose(
	withApollo,
	connect(state => ({
		editor: state.editor,
		user: state.user
	}))
)(QuillEditor);

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
