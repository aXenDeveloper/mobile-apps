import React, { Component } from 'react';
import { Text, Image, StyleSheet } from 'react-native';

export default class UserPhoto extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		const size = this.props.size || 40;

		const styles = StyleSheet.create({
			userPhoto: {
				width: size,
				height: size,
				borderRadius: (size / 2),
				backgroundColor: "#f0f0f0"
			}
		});

		return (
			<Image source={{ uri: this.props.url }} style={styles.userPhoto} resizeMode='cover' />
		);
	}
}