import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import { styleVars } from '../../styles';

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
		backgroundColor: styleVars.appBackground,
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.standard
	}
});