import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

import styles, { styleVars } from "../styles";

export default class DummyTextInput extends PureComponent {
	render() {
		return (
			<TouchableOpacity style={[styles.phWide, styles.flex, styles.flexJustifyCenter, componentStyles.textbox]} onPress={this.props.onPress}>
				<Text style={componentStyles.placeholder}>
					{this.props.placeholder}
				</Text>
			</TouchableOpacity>
		);
	}
};

const componentStyles = StyleSheet.create({
	textbox: {
		backgroundColor: '#fff',
		borderWidth: 1,
		height: 34,
		borderColor: 'rgba(0,0,0,0.15)',
		borderRadius: 20,
		width: '100%'
	},
	placeholder: {
		color: styleVars.greys.placeholder
	}
});