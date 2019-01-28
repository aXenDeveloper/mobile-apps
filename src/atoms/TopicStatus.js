import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import { styleVars } from '../styles';
import icons from '../icons';

export default class TopicStatus extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		const statuses = {
			pinned: {
				text: "Pinned",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.pinnedIcon]} resizeMode='stretch' source={icons.PINNED} />
			},
			hot: {
				text: "Hot",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.hotIcon]} resizeMode='stretch' source={icons.FIRE} />
			},
			featured: {
				text: "Featured",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.featuredIcon]} resizeMode='stretch' source={icons.STAR_SOLID} />	
			},
			locked: {
				text: "Locked",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.lockedIcon]} resizeMode='stretch' source={icons.LOCKED} />	
			},
			archived: {
				text: "Archived",
				icon: <Image style={[componentStyles.statusIcon, componentStyles.lockedIcon]} resizeMode='stretch' source={icons.ARCHIVED} />
			}
		};

		return (
			<View style={[componentStyles.wrapper, this.props.style || null ]}>
				{statuses[this.props.type]['icon']}
				{!this.props.noLabel && <Text style={[this.props.textStyle, componentStyles.status, componentStyles[this.props.type]]}>
					{statuses[this.props.type]['text']}
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
	featured: {
		color: '#409c69'
	},
	featuredIcon: {
		tintColor: '#409c69'
	},
	hot: {
		color: '#d5611b'
	},
	hotIcon: {
		tintColor: '#d5611b'
	},
	locked: {
		color: styleVars.lightText
	},
	lockedIcon: {
		tintColor: styleVars.lightText
	},
	archived: {
		color: styleVars.lightText
	},
	archivedIcon: {
		tintColor: styleVars.lightText
	}
});