import React, { Component } from 'react';
import { Text, View, Image, Switch, StyleSheet, TouchableHighlight } from 'react-native';
import _ from "underscore";

import Lang from '../utils/Lang';
import styles, { styleVars } from '../styles';
import icons from '../icons';

export default class CheckListRow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress || null}>
				<View style={[styles.row, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyBetween, styles.pWide]}>
					{_.isString( this.props.title ) ? <Text style={componentStyles.label}>{this.props.title}</Text> : this.props.title}
					<Image source={this.props.checked ? icons.CHECKMARK : null} style={componentStyles.check} resizeMode='cover' />
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
	},
	label: {
		fontSize: styleVars.fontSizes.content,
		fontWeight: "500",
		color: styleVars.text,
	}
});