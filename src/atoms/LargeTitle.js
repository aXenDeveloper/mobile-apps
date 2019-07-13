import React, { Component } from "react";
import { Text, Image, View, StyleSheet, Platform } from "react-native";

import styles, { styleVars } from "../styles";

export default class LargeTitle extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyStart, styles.mhWide, styles.mtVeryWide, styles.mbWide, componentStyles.wrapper]}>
				<Text style={[styles.largeTitle, componentStyles.largeTitle]}>{this.props.children}</Text>
			</View>
		);
	}
}

//{this.props.icon && <View style={componentStyles.iconWrap}><Image source={this.props.icon} style={componentStyles.icon} resizeMode='contain' /></View>}

const componentStyles = StyleSheet.create({
	iconWrap: {
		backgroundColor: "#009BA2",
		borderRadius: 50,
		width: 30,
		height: 30,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginRight: styleVars.spacing.tight
	},
	icon: {
		width: 18,
		height: 18,
		tintColor: "#fff"
	}
});
