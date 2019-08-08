import React, { memo } from "react";
import { Image, View, StyleSheet } from "react-native";

import styles, { styleVars } from "../styles";
import icons from "../icons";

const CommentFlag = props => (
	<View style={componentStyles.wrapper}>
		<Image source={require("../../resources/comment_flag.png")} resizeMode="contain" style={componentStyles.background} />
		<Image source={icons.HEART_SOLID} resizeMode="contain" style={componentStyles.icon} />
	</View>
);

export default memo(CommentFlag);

const componentStyles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 50,
		height: 50
	},
	background: {
		tintColor: styleVars.popularColor,
		width: 50,
		height: 50
	},
	icon: {
		width: 20,
		height: 20,
		tintColor: "#fff",
		position: "absolute",
		top: 4,
		left: 4
	}
});
