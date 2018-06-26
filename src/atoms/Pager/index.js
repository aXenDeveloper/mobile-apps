import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, TouchableHighlight } from 'react-native';

export default class Pager extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		console.log("Pager");
		return (
			<View style={styles.pager}>
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	pager: {
		backgroundColor: '#37454B',
		height: 45,
		minHeight: 45,
		padding: 10,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
});