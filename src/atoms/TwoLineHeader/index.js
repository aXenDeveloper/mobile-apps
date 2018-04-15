import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class TwoLineHeader extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<Text style={styles.headerTitle} numberOfLines={1}>{this.props.title}</Text>
				<Text style={styles.headerSubtitle}>{this.props.subtitle}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	headerTitle: {
		color: 'white',
		fontSize: 17,
		fontWeight: "500",
		textAlign: 'center'
	},	
	headerSubtitle: {
		color: 'white',
		fontSize: 12,
		textAlign: 'center',
		fontWeight: "300",
		opacity: 0.9
	}	
});