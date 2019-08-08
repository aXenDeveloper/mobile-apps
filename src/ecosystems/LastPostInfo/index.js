import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import UserPhoto from "../../atoms/UserPhoto";
import relativeTime from "../../utils/RelativeTime";
import styles, { styleVars } from "../../styles";

const LastPostInfo = props => {
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

export default LastPostInfo;

const componentStyles = StyleSheet.create({
	timestamp: {
		fontSize: 12,
		color: styleVars.lightText,
		textAlign: "center",
		marginTop: 3
	}
});
