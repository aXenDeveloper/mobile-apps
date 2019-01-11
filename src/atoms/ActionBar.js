import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TouchableHighlight } from 'react-native';

import styles, { styleVars } from "../styles";

const ActionBar = (props) => (	
	<View style={[ componentStyles.pager, props.light ? componentStyles.light : componentStyles.dark, props.style ]}>
		{props.children}
	</View>
);

export default ActionBar;

const componentStyles = StyleSheet.create({
	pager: {
		height: 45,
		minHeight: 45,
		padding: 7,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	dark: {
		backgroundColor: '#37454B',
	},
	light: {
		backgroundColor: styleVars.greys.medium,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.1)'
	}
});