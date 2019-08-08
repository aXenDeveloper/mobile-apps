import React, { memo } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";

import styles, { styleVars } from "../styles";

const DummyTextInput = props => (
	<TouchableOpacity style={[styles.phWide, styles.flex, styles.flexJustifyCenter, componentStyles.textbox]} onPress={props.onPress}>
		<Text style={componentStyles.placeholder}>{props.placeholder}</Text>
	</TouchableOpacity>
);

export default memo(DummyTextInput);

const componentStyles = StyleSheet.create({
	textbox: {
		backgroundColor: "#fff",
		height: 38,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.075)",
		borderRadius: 20,
		width: "100%"
	},
	placeholder: {
		color: styleVars.greys.placeholder
	}
});
