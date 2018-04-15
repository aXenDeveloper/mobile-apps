import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

import RichTextContent from '../RichTextContent';
import styles from '../../styles';

export default class ListItem extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		console.log( this.props );

		return (
			<View style={componentStyles.listItemWrap}>
				<View style={componentStyles.listItem}>
					<Text style={componentStyles.listTitle} numberOfLines={1}>
						{this.props.data.title}
					</Text>
					<View style={componentStyles.listValue}>
						{this.props.data.html ? 
							<RichTextContent baseFontStyle={{ color: '#8E8E93', fontSize: 15 }}>{this.props.data.value}</RichTextContent> 
							: <Text style={componentStyles.listValueText}>{this.props.data.value}</Text>}
					</View>
				</View>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	listItemWrap: {
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 13,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		minHeight: 60
	},
	listTitle: {
		fontSize: 17,
		color: '#000',
		fontWeight: "400",
		lineHeight: 18,
		marginBottom: 3,
		letterSpacing: -0.2
	},
	listValueText: {
		color: '#8E8E93',
		fontSize: 15
	},
	listItem: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center'
	}
});