import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import styles, { styleVars } from "../styles";

const Tag = props => (
	<View style={[componentStyles.tagWrapper, styles.pvVeryTight, styles.phVeryWide, styles.mvVeryTight, styles.mrStandard]}>
		<Text style={[componentStyles.tag, styles.smallText, props.style]}>
			{props.children}
		</Text>
	</View>
);

export default Tag;

const componentStyles = StyleSheet.create({
	tagWrapper: {
		borderColor: styleVars.accentColor,
		borderWidth: 1,
		borderRadius: 14,
	},
	tag: {
		color: styleVars.accentColor,
	}
});
