import React, { Component } from "react";
import { Text, View, StatusBar, SafeAreaView, TouchableHighlight, Button, StyleSheet } from "react-native";
import { Header } from "react-navigation";
import { LinearGradient } from "expo";

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
		height: isIphoneX() ? 96 : 76,
		overflow: "visible"
	},
	header: {
		shadowColor: "transparent",
		backgroundColor: "transparent",
		borderBottomWidth: 0,
		height: 36
	},
	title: {
		color: styleVars.headerText,
		fontSize: 17,
		backgroundColor: "transparent",
		textAlign: "center",
		fontWeight: "500"
	},
	transparentHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0
	}
});
