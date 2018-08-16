import React, { Component } from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';

import { styleVars } from '../styles';

export default class LargeTitle extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={componentStyles.wrapper}>
				{this.props.icon && <View style={componentStyles.iconWrap}><Image source={this.props.icon} style={componentStyles.icon} resizeMode='contain' /></View>}
				<Text style={componentStyles.largeTitle}>
					{this.props.children}
				</Text>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginHorizontal: styleVars.spacing.wide,
		marginTop: styleVars.spacing.veryWide,
		marginBottom: styleVars.spacing.wide,
	},
	iconWrap: {
		backgroundColor: '#009BA2',
		borderRadius: 50,
		width: 30,
		height: 30,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: styleVars.spacing.tight
	},
	icon: {
		width: 18,
		height: 18,
		tintColor: '#fff',
	},
	largeTitle: {
		fontWeight: 'bold',
		fontSize: 26,
		color: '#333',
	}
});