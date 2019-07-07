import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "../../styles";

const ColorField = props => {
	const backgroundColor = !props.value.startsWith("#") ? `#${props.value}` : props.value;

	if (props.value.trim() === "" || props.value === "#") {
		return <Text style={[props.textStyles, styles.lightText]}>No color</Text>;
	}

	return (
		<View style={[styles.flexRow, styles.flexAlignCenter]}>
			<View style={[componentStyles.colorSwatch, styles.mrTight, { backgroundColor }]} />
			<Text style={props.textStyles}>{props.value}</Text>
		</View>
	);
};

export default ColorField;

const componentStyles = StyleSheet.create({
	colorSwatch: {
		width: 16,
		height: 16,
		borderRadius: 3
	}
});
