import React, { memo } from "react";
import { Text, StyleSheet } from "react-native";

import styles, { styleVars } from "../styles";
import icons from "../icons";

const UnreadIndicator = props => {
	if (!props.show) {
		return null;
	}

	return <Text style={[styles.mrTight, componentStyles.dot, props.style]}>{"\u2022" + " "}</Text>;
};

export default memo(UnreadIndicator);

const componentStyles = StyleSheet.create({
	dot: {
		color: styleVars.accentColor,
		fontSize: 20
	}
});
