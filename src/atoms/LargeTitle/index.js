import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import { styleVars } from '../../styles';

export default class LargeTitle extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Text style={styles.largeTitle}>{this.props.children}</Text>
		);
	}
}

const styles = StyleSheet.create({
	largeTitle: {
		fontWeight: 'bold',
		fontSize: 26,
		color: '#35393E'
	}
});