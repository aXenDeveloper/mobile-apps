import React, { memo } from "react";
import { StyleSheet, Image } from "react-native";

import { withTheme } from "../themes";

//@todo image refs
const ForumIcon = props => {
	const { styles, componentStyles } = props;

	if (props.unread) {
		return <Image style={[props.style, componentStyles.forumIcon, componentStyles.activeIcon]} source={require("../../resources/forum_unread.png")} />;
	} else {
		return <Image style={[props.style, componentStyles.forumIcon, componentStyles.inactiveIcon]} source={require("../../resources/forum_read.png")} />;
	}
};

const _componentStyles = styleVars => ({
	forumIcon: {
		width: 20,
		height: 19
	},
	activeIcon: {
		tintColor: "#2080A7" // @todo color
	},
	inactiveIcon: {
		tintColor: "#8F8F8F" // @todo color
	}
});

export default withTheme(_componentStyles)(memo(ForumIcon));
