import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';

export default class ForumIcon extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		if( this.props.unread ){
			return <Image style={[this.props.style, styles.forumIcon, styles.activeIcon]} source={require('../../resources/forum_unread.png')} />;
		} else {
			return <Image style={[this.props.style, styles.forumIcon, styles.inactiveIcon]} source={require('../../resources/forum_read.png')} />;
		}
	}
}

const styles = StyleSheet.create({
	forumIcon: {
		width: 20,
		height: 19
	},
	activeIcon: {
		tintColor: '#2080A7'
	},
	inactiveIcon: {
		tintColor: '#8F8F8F'
	}
});