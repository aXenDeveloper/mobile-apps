import React, { memo } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

import styles, { styleVars } from "../styles";

const Badge = props => (
	<View style={[componentStyles.notificationBadge, props.style]}>
		<Text style={componentStyles.notificationBadgeText}>{props.count}</Text>
	</View>
);

export default memo(Badge);

const componentStyles = StyleSheet.create({
	notificationBadge: {
		height: 19,
		minWidth: 19,
		borderRadius: 19,
		paddingHorizontal: 4,
		backgroundColor: styleVars.badgeBackground,
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	notificationBadgeText: {
		color: styleVars.badgeText,
		fontSize: 10,
		fontWeight: "bold"
	}
});
