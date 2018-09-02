import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { styleVars } from '../styles';

export default class TopicStatus extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		const lang = {
			pinned: {
				text: "Pinned",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.pinnedIcon]} resizeMode='stretch' source={require('../../resources/pinned.png')} />
			},
			hot: {
				text: "Hot",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.hotIcon]} resizeMode='stretch' source={require('../../resources/hot.png')} />
			}
		};

		return (
			<View style={[componentStyles.wrapper, this.props.style || null ]}>
				{lang[this.props.type]['icon']}
				{!this.props.noLabel && <Text style={[this.props.textStyle, componentStyles.status, componentStyles[this.props.type]]}>
					{lang[this.props.type]['text']}
				</Text>}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	status: {
		fontWeight: "500",
		fontSize: 13
	},
	statusIcon: {
		width: 12,
		height: 12,
		marginRight: styleVars.spacing.veryTight
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