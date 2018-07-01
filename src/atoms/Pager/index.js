import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TouchableHighlight } from 'react-native';

export default class Pager extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[ styles.pager, this.props.light ? styles.light : styles.dark ]}>
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
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
		backgroundColor: '#f0f0f0',
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.1)'
	}
});