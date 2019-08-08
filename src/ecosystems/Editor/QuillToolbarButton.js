import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";

const QuillToolbarButton = props => (
	<TouchableOpacity style={[buttonStyles.button, props.active ? buttonStyles.activeButton : null]} onPress={props.onPress}>
		<Image source={props.icon} style={[buttonStyles.image, props.active ? buttonStyles.activeImage : null]} />
	</TouchableOpacity>
);

export default QuillToolbarButton;

const buttonStyles = StyleSheet.create({
	button: {
		width: 34,
		height: 34,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 5,
		borderRadius: 34
	},
	activeButton: {
		backgroundColor: "#f5f5f7"
	},
	image: {
		tintColor: "#8e8e93",
		width: 20,
		height: 20
	},
	activeImage: {
		tintColor: "#000"
	}
});
