import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import { withTheme } from "../themes";

class ListItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { componentStyles } = this.props;

		return (
			<View style={componentStyles.listItemWrap}>
				<View style={componentStyles.listItem}>
					<Text style={componentStyles.listTitle} numberOfLines={1}>
						{this.props.data.title}
					</Text>
					<View style={componentStyles.listValue}>
						{this.props.data.html ? (
							<RichTextContent baseFontStyle={{ color: "#8E8E93", fontSize: 15 }}>{this.props.data.value}</RichTextContent>
						) : (
							<Text style={componentStyles.listValueText}>{this.props.data.value}</Text>
						)}
					</View>
				</View>
			</View>
		);
	}
}

const _componentStyles = styleVars => ({
	listItemWrap: {
		backgroundColor: "#fff", // @todo color
		paddingHorizontal: 16,
		paddingVertical: 13,
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "stretch",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#F2F4F7", // @todo color
		minHeight: 60
	},
	listTitle: {
		fontSize: 17,
		color: "#000", // @todo color
		fontWeight: "400",
		lineHeight: 18,
		marginBottom: 3,
		letterSpacing: -0.2
	},
	listValueText: {
		color: "#8E8E93", // @todo color
		fontSize: 15
	},
	listItem: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignContent: "center"
	}
});

export default withTheme(_componentStyles)(ListItem);
