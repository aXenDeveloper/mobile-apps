import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import _ from "underscore";

import styles, { styleVars } from '../styles';

const icons = {
	settings: require('../../resources/settings.png')
};

const HeaderButton = (props) => {
	let imageToUse = null;

	if( props.icon ){
		imageToUse = ( !_.isUndefined(icons[ props.icon ]) ? icons[ props.icon ] : props.icon );
	}

	return (
		<TouchableOpacity style={[componentStyles.wrapper, props.position == 'left' ? styles.mlWide : styles.mrWide, props.style]} onPress={props.onPress || null}>
			{imageToUse !== null && <Image source={imageToUse} style={[ componentStyles.icon, { width: props.size || 26, height: props.size || 26 } ]} />}
			{Boolean(props.label) && <Text style={componentStyles.label}>{props.label}</Text>}
		</TouchableOpacity>
	);
}

export default HeaderButton;

const componentStyles = StyleSheet.create({
	icon: {
		tintColor: styleVars.headerText,
		width: 26,
		height: 26
	},
	label: {
		color: styleVars.headerText,
		fontSize: 17
	}
});