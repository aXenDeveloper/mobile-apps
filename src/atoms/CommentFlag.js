import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';

import styles, { styleVars } from '../styles';
import icons from '../icons';

export default class CommentFlag extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={componentStyles.wrapper}>
				<Image source={require('../../resources/comment_flag.png')} resizeMode='contain' style={componentStyles.background} />
				<Image source={icons.HEART_SOLID} resizeMode='contain' style={componentStyles.icon} />
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 50
	},
	background: {
		tintColor: styleVars.popularColor,
		width: 50,
		height: 50
	},
	icon: {
		width: 20,
		height: 20,
		tintColor: '#fff',
		position: 'absolute',
		top: 4,
		left: 4
	}
});