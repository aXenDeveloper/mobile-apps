import React, { Component } from "react";
import { Text, View, StatusBar, SafeAreaView, TouchableHighlight, Button, StyleSheet, Platform } from "react-native";
import { Header } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";

import { isIphoneX } from "../../utils/isIphoneX";
import { styleVars } from "../../styles";

export default class CustomHeader extends Component {
	constructor(props) {
		super(props);
	}

	_navigateBack = () => {
		this.props.navigation.goBack(null);
	};

	_renderBackButton = props => {
		if (props.scene.index === 0) {
			return null;
		}
		return (
			<TouchableHighlight onPress={this._navigateBack}>
				<Text style={styles.action}>Back</Text>
			</TouchableHighlight>
		);
	};

	render() {
		let content;

		if (this.props.content) {
			content = this.props.content;
		} else {
			content = <Header {...this.props} style={styles.header} />;
		}

		return (
			<LinearGradient
				start={[0, 0]}
				end={[1, 0]}
				colors={this.props.transparent ? ["rgba(0,0,0,0)", "rgba(0,0,0,0)"] : styleVars.primaryBrand}
				style={styles.headerWrap}
			>
				<StatusBar barStyle="light-content" translucent />
				{content}
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	headerWrap: {
		height: Platform.OS === "ios" ? (isIphoneX() ? 96 : 76) : 82,
		overflow: "visible"
	}
});
