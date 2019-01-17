import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

import styles, { styleVars } from "../styles";
import icons from "../icons";

const ReplyButton = props => {
	return (
		<TouchableOpacity style={[componentStyles.replyButton, styles.flex, styles.flexAlignCenter, styles.flexJustifyCenter, props.style]} onPress={props.onPress}>
			<Image source={icons.QUOTE_SOLID} resizeMode="contain" style={componentStyles.icon} />
		</TouchableOpacity>
	);
};

export default ReplyButton;

const componentStyles = StyleSheet.create({
	replyButton: {
		backgroundColor: '#37454B',
		width: 50,
		height: 50,
		borderRadius: 50,
		position: "absolute",
		bottom: 45,
		right: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,

		elevation: 4,
	},
	icon: {
		tintColor: styleVars.reverseText,
		width: 23,
		height: 23
	}
});
