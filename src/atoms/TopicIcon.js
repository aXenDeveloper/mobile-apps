import React, { memo } from "react";
import { StyleSheet, Image } from "react-native";

// @todo image refs
// @todo styles
const TopicIcon = props => {
	if (props.unread) {
		return <Image style={[props.style, styles.topicIcon, styles.activeIcon]} resizeMode="contain" source={require("../../resources/topic_unread.png")} />;
	} else {
		return <Image style={[props.style, styles.topicIcon, styles.inactiveIcon]} resizeMode="contain" source={require("../../resources/topic_read.png")} />;
	}
};

export default memo(TopicIcon);

const styles = StyleSheet.create({
	topicIcon: {
		width: 11,
		height: 11
	},
	activeIcon: {
		tintColor: "#2080A7"
	},
	inactiveIcon: {
		tintColor: "#8F8F8F"
	}
});
