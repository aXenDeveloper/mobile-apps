import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

export default class FollowButton extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		let imageToUse = this.props.followed ? require('../../resources/bookmark_active.png') : require('../../resources/bookmark.png');

		return (
			<TouchableOpacity style={componentStyles.wrapper} onPress={this.props.onPress || null}>
				<Image source={imageToUse} style={componentStyles.icon} />
			</TouchableOpacity>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		marginRight: 12
	},
	icon: {
		tintColor: '#fff',
		width: 26,
		height: 26
	}
});