import React, { memo } from "react";
import { Image, Text, View, StyleSheet, TouchableHighlight } from "react-native";

import getImageUrl from "../utils/getImageUrl";

const ReactionChoice = props => (
	<TouchableHighlight activeOpacity={0.8} onPress={props.onPress} style={componentStyles.reaction}>
		<React.Fragment>
			<Image source={{ uri: getImageUrl(props.image) }} style={componentStyles.image} />
			<Text style={componentStyles.text}>{props.name}</Text>
		</React.Fragment>
	</TouchableHighlight>
);

export default memo(ReactionChoice);

const componentStyles = StyleSheet.create({
	reaction: {
		backgroundColor: "#f5f5f5",
		borderRadius: 50,
		width: 200,
		height: 40,
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		marginBottom: 5,
		padding: 5
	},
	image: {
		width: 30,
		height: 30,
		marginRight: 10
	},
	text: {
		fontSize: 17,
		fontWeight: "500"
	}
});
