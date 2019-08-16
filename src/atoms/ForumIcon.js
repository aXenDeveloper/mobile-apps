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
		tintColor: styleVars.unread.active
	},
	inactiveIcon: {
		tintColor: styleVars.unread.inactive
	}
});

export default withTheme(_componentStyles)(memo(ForumIcon));
