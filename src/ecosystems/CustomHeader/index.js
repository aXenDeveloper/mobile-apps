import React, { Component } from "react";
import { Text, View, StatusBar, TouchableHighlight, Button, StyleSheet } from "react-native";
import { Header } from "react-navigation";
import { LinearGradient } from "expo";

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
		if (this.props.transparent) {
			return <Header {...this.props} style={[styles.header, styles.transparentHeader]} />;
		} else {
			return (
				<LinearGradient start={[0, 0]} end={[1, 0]} colors={["#3370AA", "#009BA2"]} style={styles.headerWrap}>
					<StatusBar barStyle="light-content" translucent />
					<Header {...this.props} style={styles.header} />
				</LinearGradient>
			);
		}
	}
}

const styles = StyleSheet.create({
	headerWrap: {
		height: 76
	},
	header: {
		shadowColor: "transparent",
		backgroundColor: "transparent",
		borderBottomWidth: 0,
		height: 36
	},
	title: {
		color: "white",
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
