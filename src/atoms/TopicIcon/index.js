import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';

export default class TopicIcon extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		if( this.props.unread ){
			return <Image style={[this.props.style, styles.topicIcon, styles.activeIcon]} resizeMode='stretch' source={require('../../../resources/topic_unread.png')} />;
		} else {
			return <Image style={[this.props.style, styles.topicIcon, styles.inactiveIcon]} resizeMode='stretch' source={require('../../../resources/topic_read.png')} />;
		}
	}
}

const styles = StyleSheet.create({
	topicIcon: {
		width: 12,
		height: 12,
	},
	activeIcon: {
		tintColor: '#2080A7'
	},
	inactiveIcon: {
		tintColor: '#8F8F8F'
	}
});