import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { withTheme } from "../themes";

const StreamHeader = ({ componentStyles, ...props }) => (
	<View style={[componentStyles.container, props.style]}>
		<View style={componentStyles.header}>
			<Text style={componentStyles.text}>{props.title}</Text>
		</View>
	</View>
);

const _componentStyles = {
	container: {
		display: "flex",
		alignItems: "flex-start",
		marginHorizontal: 9,
		marginTop: 9,
		marginBottom: 15
	},
	header: {
		backgroundColor: "#000", // @todo color
		height: 28,
		borderRadius: 30,
		paddingHorizontal: 15,
		display: "flex",
		justifyContent: "center"
	},
	text: {
		color: "#fff", // @todo color
		fontSize: 13
	}
};

export default withTheme(_componentStyles)(memo(StreamHeader));
