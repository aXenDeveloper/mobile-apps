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
			<View style={[styles.row, this.props.lastRow && styles.lastRow, componentStyles.menuItemWrap]}>
				<View style={componentStyles.menuItem}>
					<Text style={[styles.text, styles.contentText]}>{this.props.title}</Text>
					{Boolean(this.props.subText) && <Text style={componentStyles.metaText}>{this.props.subText}</Text>}
				</View>
				<Switch
					trackColor={{ true: styleVars.toggleTint }}
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
	metaText: {
		color: styleVars.veryLightText,
		fontSize: 12
	},
	switch: {
		marginLeft: styleVars.spacing.standard
	}
});
