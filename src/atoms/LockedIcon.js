import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';

export default class LockedIcon extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return <Image style={[this.props.style, styles.topicIcon]} resizeMode='stretch' source={require('../../resources/locked.png')} />;
	}
}

const styles = StyleSheet.create({
	icon: {
		width: 12,
		height: 12,
	}
});