import React, { Component } from "react";
import { Text, View, WebView } from "react-native";
import { compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import NavigationService from "../../utils/NavigationService";

const MESSAGE_PREFIX = Expo.Constants.manifest.extra.message_prefix;

class WebViewScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.state.params.title
	});

	static injectedJavaScript = `
		// Post message hack fix
		var originalPostMessage = window.postMessage;
		var patchedPostMessage = function(message, targetOrigin, transfer) { 
			originalPostMessage(message, targetOrigin, transfer);
		};

		patchedPostMessage.toString = function() { 
			return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
		};

		window.postMessage = patchedPostMessage;

		function sendTitle() {
			sendMessage('DOCUMENT_TITLE', { title: document.title });
		}

		function sendMessage(message, data = {}) {
			console.log( data );
			const messageToSend = JSON.stringify({
				message: '${MESSAGE_PREFIX}' + message,
				...data
			});

			window.postMessage(messageToSend, "*");
		}

		function shouldSendLinkToNative(link) {
			if( link.matches('a[data-ipsMenu]') || link.matches('a[data-ipsDialog]') ){
				return false;
			}

			if( link.getAttribute('href') == 'undefined' || link.getAttribute('href').startsWith('#') ){
				return false;
			}

			return true;
		}

		function clickHandler(e) {
			var link = e.target;

			if( !link.matches('a') ){
				link = link.closest('a');

				if( link === null ) {
					return false;
				}
			}

			if( shouldSendLinkToNative( link ) ){
				e.preventDefault();
				e.stopPropagation();
				sendMessage("GO_TO_URL", {
					url: link.getAttribute('href')
				});
			}
		}

		setInterval( sendTitle, 500 );
		document.addEventListener('click', clickHandler);
	`;

	constructor(props) {
		super(props);
		this.onMessage = this.onMessage.bind(this);

		if (!_.isUndefined(this.props.navigation.state.params) && !_.isUndefined(this.props.navigation.state.params.title)) {
			this.props.navigation.setParams({
				title: Lang.get("loading")
			});
		}

		this.state = {
			currentUrl: this.props.navigation.state.params.url
		};
	}

	onMessage(e) {
		try {
			const messageData = JSON.parse(e.nativeEvent.data);
			const supported = ["DEBUG", "DOCUMENT_TITLE", "GO_TO_URL"];

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				if (supported.indexOf(messageType) !== -1 && this[messageType]) {
					this[messageType].call(this, messageData);
				}
			}
		} catch (err) {
			/* Ignore */
		}
	}

	DEBUG(data) {
		console.log("DEBUG: " + data.debugMessage);
	}

	DOCUMENT_TITLE(data) {
		// Remove " - <board_name>" from title, no need to show it in-app
		const fixedTitle = data.title.replace(` - ${this.props.site.settings.board_name}`, "");

		if (fixedTitle !== this.props.navigation.state.params.title) {
			this.props.navigation.setParams({
				title: fixedTitle
			});
		}
	}

	GO_TO_URL(data) {
		console.log("Navigating to " + data.url);
		NavigationService.navigate({
			url: data.url
		});
	}

	render() {
		let headers = {};

		// If this is an internal URL, we set headers to authorize the user inside the webview
		if (NavigationService.isInternalUrl(this.state.currentUrl)) {
			headers["x-ips-app"] = "true";

			if (this.props.auth.isAuthenticated) {
				headers["x-ips-accesstokenmember"] = `${this.props.user.id}`;
				headers["authorization"] = `Bearer ${this.props.auth.authData.accessToken}`;
			}
		}

		return (
			<View style={{ flex: 1 }}>
				<WebView
					source={{ uri: this.state.currentUrl, headers }}
					style={{ flex: 1 }}
					onMessage={this.onMessage}
					ref={webview => (this.webview = webview)}
					javaScriptEnabled={true}
					injectedJavaScript={WebViewScreen.injectedJavaScript}
					mixedContentMode="always"
				/>
			</View>
		);
	}
}

export default compose(
	connect(state => ({
		auth: state.auth,
		site: state.site,
		user: state.user
	}))
)(WebViewScreen);
