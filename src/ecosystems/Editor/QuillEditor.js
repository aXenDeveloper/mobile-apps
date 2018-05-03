import React, { Fragment, Component } from "react";
import { View, KeyboardAvoidingView, Button, WebView, StyleSheet } from "react-native";
import styles from "../../styles";
//import AdvancedWebView from 'react-native-advanced-webview';

const EDITOR_VIEW = require("../../../web/dist/index.html");
const MESSAGE_PREFIX = Expo.Constants.manifest.extra.message_prefix;

const patchPostMessageJsCode = `(${String(function() {
	var originalPostMessage = window.postMessage;
	var patchedPostMessage = function(message, targetOrigin, transfer) {
		originalPostMessage(message, targetOrigin, transfer);
	};
	patchedPostMessage.toString = function() {
		return String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
	};
	window.postMessage = patchedPostMessage;
})})();`;

export default class QuillEditor extends Component {
	constructor(props) {
		super(props);
		this.webview = React.createRef();
		this.state = {
			loading: true,
			focused: false
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
		debugger;

		try {
			const messageData = JSON.parse(e.nativeEvent.data);

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				switch (messageType) {
					case "EDITOR_FOCUS":
						this.setState({
							focused: true
						});
						break;
					case "EDITOR_BLUR":
						this.setState({
							focused: false
						});
						break;
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	addDebug(message) {
		this.setState({
			debug: this.state.debug.push(message)
		});
	}

	pressBold(e) {
		console.log("Press bold");
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<WebView
					source={EDITOR_VIEW}
					onMessage={this.onMessage.bind(this)}
					ref={this.webview}
					javaScriptEnabled={true}
					injectedJavaScript={patchPostMessageJsCode}
					mixedContentMode="always"
					scalesPageToFit={false}
					style={editorStyles.editor}
					hideAccessory={true}
				/>
				{this.state.focused ? (
					<View style={[toolbarStyles.toolbar]}>
						<Button title="B" onPress={this.pressBold} />
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
	toolbar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 108,
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#c7c7c7"
	}
});
