import React, { memo } from "react";
import { StyleSheet, Image, TouchableOpacity, Text } from "react-native";

const AddButton = props => (
	<TouchableOpacity style={componentStyles.button} onPress={props.onPress}>
		<React.Fragment>
			<Image style={componentStyles.icon} resizeMode="stretch" source={props.icon} />
			<Text style={componentStyles.text}>{props.title}</Text>
		</React.Fragment>
	</TouchableOpacity>
);

export default memo(AddButton);

const componentStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		width: 16,
		height: 16
	},
	text: {
		color: "#fff",
		fontSize: 15,
		marginLeft: 6
	}
});
