import React, { memo } from "react";
import { StyleSheet, Image } from "react-native";

//@todo image refs
const ForumIcon = props => {
	if (props.unread) {
		return <Image style={[props.style, styles.forumIcon, styles.activeIcon]} source={require("../../resources/forum_unread.png")} />;
	} else {
		return <Image style={[props.style, styles.forumIcon, styles.inactiveIcon]} source={require("../../resources/forum_read.png")} />;
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
