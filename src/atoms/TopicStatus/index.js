import React, { Component } from 'react';
import { StyleSheet, Text, Image } from 'react-native';

export default class TopicStatus extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		const lang = {
			pinned: {
				text: "Pinned",
				icon: <Image style={[styles.statusIcon, styles.pinnedIcon]} resizeMode='stretch' source={require('../../../resources/pinned.png')} />
			},
			hot: {
				text: "Hot",
				icon: <Image style={[styles.statusIcon, styles.hotIcon]} resizeMode='stretch' source={require('../../../resources/hot.png')} />
			}
		};

		return <Text style={[this.props.style, styles.status, styles[this.props.type]]}>{lang[this.props.type]['icon']} {lang[this.props.type]['text'].toUpperCase()}</Text>
	}
}

const styles = StyleSheet.create({
	status: {
		fontWeight: "500",
		fontSize: 11
	},
	statusIcon: {
		width: 12,
		height: 12,
		marginTop: 2
	},
	pinned: {
		color: '#409c69'
	},
	pinnedIcon: {
		tintColor: '#409c69'
	},
	hot: {
		color: '#d5611b'
	},
	hotIcon: {
		tintColor: '#d5611b'
	}
});