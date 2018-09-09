import React, { Component } from "react";
import { Text, View, Image, Switch, StyleSheet, TouchableOpacity } from "react-native";
import _ from "underscore";

import Lang from "../utils/Lang";
import styles, { styleVars } from "../styles";

export default class ToggleRow extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.row, componentStyles.menuItemWrap]}>
				<View style={componentStyles.menuItem}>
					<Text style={componentStyles.label}>{this.props.title}</Text>
					{this.props.subText && <Text style={componentStyles.metaText}>{this.props.subText}</Text>}
				</View>
				<Switch
					onTintColor={styleVars.toggleTint}
					value={this.props.value}
					disabled={!_.isUndefined(this.props.enabled) ? !this.props.enabled : false}
					style={componentStyles.switch}
					onValueChange={this.props.onToggle || null}
				/>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	icon: {
		width: 24,
		height: 24,
		tintColor: styleVars.lightText,
		marginRight: 12
	},
	menuItem: {
		flex: 1
	},
	label: {
		fontSize: 15,
		color: styleVars.text,
		fontWeight: "500"
	},
	metaText: {
		color: styleVars.veryLightText,
		fontSize: 12
	},
	switch: {
		marginLeft: styleVars.spacing.standard
	}
});
