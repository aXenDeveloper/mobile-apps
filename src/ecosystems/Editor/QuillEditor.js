import React, { Component } from "react";
import { View, KeyboardAvoidingView, Button, WebView, StyleSheet } from 'react-native';
import AdvancedWebView from 'react-native-advanced-webview';

const EDITOR_VIEW = require('../../../web/dist/index.html');
const patchPostMessageJsCode = `(${String(function() {
    var originalPostMessage = window.postMessage
    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer)
    }
    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    }
    window.postMessage = patchedPostMessage
})})();`

export default class QuillEditor extends Component {
	constructor(props) {
		super(props);
		this.webview = React.createRef();
		this.state = {
			loading: true
		}
	}

	componentDidMount() {

	}

	onMessage(e) {
		console.log(e.data);
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
			<KeyboardAvoidingView style={{flex: 1}} enabled behavior='padding'>
				<AdvancedWebView
					source={EDITOR_VIEW}
					onMessage={this.onMessage}
					ref={this.webview}
					javaScriptEnabled={true}
					injectedJavaScript={patchPostMessageJsCode}
					mixedContentMode='always'
					scalesPageToFit={false}
					style={editorStyles.editor}
					hideAccessory={true}
				/>
				<View style={toolbarStyles.toolbar}>
					<Button title='B' onPress={this.pressBold} />
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const editorStyles = StyleSheet.create({
	editor: {
		flex: 1,
	}
});

const toolbarStyles = StyleSheet.create({
	toolbar: {
		height: 108,
		backgroundColor: '#ffffff',
		borderTopWidth: 1,
		borderTopColor: '#bbc6ce'
	}
});