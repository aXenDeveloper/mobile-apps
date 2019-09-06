import React, { memo } from "react";
import { StyleSheet, Image } from "react-native";

import icons from "../icons";

//@todo image refs
const ForumIcon = props => {
	if (props.type == "redirect") {
		return <Image style={[props.style, styles.forumIcon, styles.inactiveIcon]} source={icons.FORUM_REDIRECT} />;
	} else if (props.unread) {
		return <Image style={[props.style, styles.forumIcon, styles.activeIcon]} source={icons.FORUM_UNREAD} />;
	} else {
		return <Image style={[props.style, styles.forumIcon, styles.inactiveIcon]} source={icons.FORUM_READ} />;
	}
};

export default memo(ForumIcon);

const styles = StyleSheet.create({
	forumIcon: {
		width: 20,
		height: 19
	},
	activeIcon: {
		tintColor: "#2080A7"
	},
	inactiveIcon: {
		tintColor: "#8F8F8F"
	}
});
