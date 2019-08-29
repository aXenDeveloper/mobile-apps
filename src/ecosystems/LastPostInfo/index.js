import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import UserPhoto from "../../atoms/UserPhoto";
import Time from "../../atoms/Time";
import styles, { styleVars } from "../../styles";

const LastPostInfo = props => {
	if (Boolean(props.photo) && Boolean(props.timestamp)) {
		return (
			<View style={props.style}>
				<UserPhoto url={props.photo} size={props.photoSize} />
				<Time timestamp={props.timestamp} style={componentStyles.timestamp} />
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
