import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import _ from "underscore";

import styles, { styleVars } from '../styles';

const icons = {
	settings: require('../../resources/settings.png')
};

const HeaderButton = (props) => {
	const imageToUse = !_.isUndefined(icons[ props.icon ]) ? icons[ props.icon ] : props.icon;

	return (
		<TouchableOpacity style={[componentStyles.wrapper, props.position == 'left' ? styles.mlWide : styles.mrWide, props.style]} onPress={props.onPress || null}>
			<Image source={imageToUse} style={[ componentStyles.icon, { width: props.size || 26, height: props.size || 26 } ]} />
		</TouchableOpacity>
	);
}

export default HeaderButton;

const componentStyles = StyleSheet.create({
	icon: {
		tintColor: styleVars.headerText,
		width: 26,
		height: 26
	}
});