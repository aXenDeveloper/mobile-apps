import React, { memo } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";

import styles, { styleVars } from "../styles";

const MenuItem = props => (
	<TouchableOpacity onPress={props.data.onPress || null} style={componentStyles.menuItemWrap}>
		{Boolean(props.data.icon) && <Image source={props.data.icon} style={componentStyles.icon} />}
		<Text style={componentStyles.menuItem}>{props.data.text}</Text>
	</TouchableOpacity>
);

export default memo(MenuItem);

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 9
	},
	icon: {
		width: 24,
		height: 24,
		tintColor: styleVars.lightText,
		marginRight: 12
	},
	menuItem: {
		fontSize: 15,
		color: styleVars.text
	}
});
