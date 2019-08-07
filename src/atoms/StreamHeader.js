import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

const StreamHeader = props => (
	<View style={[componentStyles.container, props.style]}>
		<View style={componentStyles.header}>
			<Text style={componentStyles.text}>{props.title}</Text>
		</View>
	</View>
);

export default memo(StreamHeader);

const componentStyles = StyleSheet.create({
	container: {
		display: "flex",
		alignItems: "flex-start",
		marginHorizontal: 9,
		marginTop: 9,
		marginBottom: 15
	},
	header: {
		backgroundColor: "#000",
		height: 28,
		borderRadius: 30,
		paddingHorizontal: 15,
		display: "flex",
		justifyContent: "center"
	},
	text: {
		color: "#fff",
		fontSize: 13
	}
});
