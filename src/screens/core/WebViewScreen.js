import React, { Component } from "react";
import { Text, View, WebView } from "react-native";

export default class WebViewScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: "..."
	});

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<WebView source={{uri: this.props.navigation.state.params.url}} style={{ flex: 1 }} />
			</View>
		);
	}
}