import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default class PostControls extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.postControls}>
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	postControls: {
		borderTopWidth: 1,
		borderTopColor: '#CED6DB',
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'center',
		marginTop: 16
	}
});