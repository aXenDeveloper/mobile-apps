import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import CustomField from "../../ecosystems/CustomField";
import styles, { styleVars } from "../../styles";

const ProfileField = props => {
	let value;

	try {
		value = JSON.parse(props.value);
	} catch (err) {
		console.log(`Invalid JSON in ${props.type} field`);
		return null;
	}

	return (
		<View style={[styles.row, styles.phWide, styles.pvStandard, styles.flex, styles.flexJustifySpaceBetween, componentStyles.fieldRowWrap, props.style]}>
			<Text style={[styles.itemTitle, componentStyles.listTitle]} numberOfLines={1}>
				{props.title}
			</Text>
			<CustomField type={props.type} value={value} />
		</View>
	);
};

export default ProfileField;

const componentStyles = StyleSheet.create({
	listItemWrap: {
		borderBottomWidth: 1,
		borderBottomColor: styleVars.borderColors.medium,
		minHeight: 60
	},
	listTitle: {
		marginBottom: 2
	}
});
