import React, { Component } from "react";
import { View, StyleSheet, Platform } from "react-native";

import styles, { styleVars } from "../styles";

const PostControls = props => {
	return (
		<View
			style={[
				Platform.OS === "ios" ? styles.flexJustifyCenter : styles.flexJustifyStart,
				styles.flexRow,
				styles.flexGrow,
				styles.flexAlignStretch,
				componentStyles.postControls,
				props.style
			]}
		>
			{props.children}
		</View>
	);
};

export default PostControls;

const componentStyles = StyleSheet.create({
	postControls: {
		borderTopWidth: 1,
		borderTopColor: styleVars.borderColors.medium
	}
});
