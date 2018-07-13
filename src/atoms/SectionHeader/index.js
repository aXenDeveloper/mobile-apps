import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

export default class SectionHeader extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Text style={styles.sectionHeader}>{this.props.title.toUpperCase()}</Text>
		);
	}
}

const styles = StyleSheet.create({
	sectionHeader: {
		fontSize: 13,
		color: '#6D6D72',
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 11,
		paddingBottom: 11
	}
});