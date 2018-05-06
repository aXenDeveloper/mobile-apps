import React, { Fragment, Component } from "react";
import { View, KeyboardAvoidingView, Button, WebView, StyleSheet } from "react-native";
import _ from "lodash";
import styles from "../../styles";
import { QuillToolbarButton } from "./QuillToolbarButton";
//import AdvancedWebView from 'react-native-advanced-webview';

const EDITOR_VIEW = require("../../../web/dist/index.html");
const MESSAGE_PREFIX = Expo.Constants.manifest.extra.message_prefix;
const util = require("util");

/*const patchPostMessageJsCode = `(${String(function() {
	var originalPostMessage = window.postMessage;
	var patchedPostMessage = function(message, targetOrigin, transfer) {
		originalPostMessage(message, targetOrigin, transfer);
	};
	patchedPostMessage.toString = function() {
		return String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
	};
	window.postMessage = patchedPostMessage;
})})();`;*/

const formattingOptions = {
	bold: true,
	italic: true,
	underline: true,
	list: ["bullet", "ordered"]
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
			formatting: formattingState
		};
	}

	componentDidMount() {}

	/**
	 * Handle messages sent from the WebView
	 *
	 * @param 	string 	token 	The refresh token to use
	 * @return 	void
	 */
	onMessage(e) {
		try {
			const messageData = JSON.parse(e.nativeEvent.data);

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				switch (messageType) {
					case "EDITOR_BLUR":
						this.setState({
							focused: false
						});
						break;
					case "FORMATTING":
						this.setState({
							focused: true
						});

						this.setButtonState(messageData.formatState);
						break;
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

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
			},
			() => console.log(this.state)
		);
	}

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

	render() {
		return (
			<View style={{ flex: 1 }}>
				<WebView
					source={EDITOR_VIEW}
					onMessage={this.onMessage.bind(this)}
					ref={webview => (this.webview = webview)}
					javaScriptEnabled={true}
					//injectedJavaScript={patchPostMessageJsCode}
					mixedContentMode="always"
					scalesPageToFit={false}
					style={editorStyles.editor}
					hideAccessory={true}
				/>
				{this.state.focused ? (
					<View style={[toolbarStyles.toolbarOuter]}>
						<View style={toolbarStyles.toolbarInner}>
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
		height: 108,
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
