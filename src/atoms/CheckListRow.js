import React, { Component } from "react";
import { Text, View, Image, Switch, StyleSheet, TouchableHighlight } from "react-native";
import _ from "underscore";

import Lang from "../utils/Lang";
import styles, { styleVars } from "../styles";
import icons from "../icons";

export default class CheckListRow extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress || null}>
				<View style={[styles.row, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyBetween, styles.phWide, styles.pvStandard]}>
					<View>
						{_.isString(this.props.title) ? <Text style={[styles.text, styles.contentText]}>{this.props.title}</Text> : this.props.title}
						{this.props.subText && <Text style={[styles.lightText, styles.smallText]}>{this.props.subText}</Text>}
					</View>
					<Image source={this.props.checked ? icons.CHECKMARK : null} style={componentStyles.check} resizeMode="cover" />
				</View>
			</TouchableHighlight>
		);
	}
}

const componentStyles = StyleSheet.create({
	check: {
		width: 16,
		height: 13,
		tintColor: styleVars.checkmarkColor
	}
});
