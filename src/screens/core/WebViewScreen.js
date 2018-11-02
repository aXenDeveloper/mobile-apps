import React, { Component } from "react";
import { Text, View, WebView } from "react-native";
import { compose } from "react-apollo";
import { connect } from "react-redux";

class WebViewScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: "..."
	});

	constructor(props) {
		super(props);
	}

	render() {
		let headers = {};

		if( this.props.navigation.state.params.url.startsWith( this.props.site.settings.base_url ) ){
			headers = { 'x-ips-app': 'true' };
		}

		return (
			<View style={{ flex: 1 }}>
				<WebView source={{uri: this.props.navigation.state.params.url, headers }} style={{ flex: 1 }} />
			</View>
		);
	}
}

export default compose(
	connect(state => ({
		site: state.site
	}))
)(WebViewScreen);