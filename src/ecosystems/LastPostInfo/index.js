import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import UserPhoto from "../../atoms/UserPhoto";
import relativeTime from "../../utils/RelativeTime";
import { withTheme } from "../../themes";

const LastPostInfo = ({ componentStyles, ...props }) => {
	if (Boolean(props.photo) && Boolean(props.timestamp)) {
		return (
			<View style={props.style}>
				<UserPhoto url={props.photo} size={props.photoSize} />
				<Text style={componentStyles.timestamp}>{relativeTime.short(props.timestamp)}</Text>
			</View>
		);
	}

	return null;
};

const _componentStyles = styleVars => ({
	timestamp: {
		fontSize: 12,
		color: styleVars.lightText,
		textAlign: "center",
		marginTop: 3
	}
});

export default withTheme(_componentStyles)(LastPostInfo);
