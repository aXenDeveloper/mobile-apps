import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { readableColor } from 'polished';

import styles, { styleVars } from '../styles';

export default class ErrorBox extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[componentStyles.wrapper, this.props.transparent ? componentStyles.transparent : null, this.props.style]}>
				{this.props.showIcon !== false && <Image source={require("../../resources/error.png")} style={componentStyles.icon} />}
				<Text style={componentStyles.message}>{this.props.message ? this.props.message : "Sorry, there was a problem loading this"}</Text>
				{this.props.refresh && <TouchableOpacity onPress={this.props.refresh} style={componentStyles.refresh}><Text style={componentStyles.refreshText}>Try Again</Text></TouchableOpacity>}
				{this.props.errorCode && <Text style={componentStyles.errorCode}>Code {this.props.errorCode}</Text>}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		backgroundColor: styleVars.appBackground,
		padding: styleVars.spacing.wide,
		margin: styleVars.spacing.wide,
		display: 'flex',
		alignItems: 'center'
	},
	transparent: {
		backgroundColor: 'transparent'
	},
	icon: {
		width: 30,
		height: 30,
		tintColor: readableColor(styleVars.appBackground),
		opacity: 0.3,
		marginBottom: styleVars.spacing.wide
	},
	message: {
		fontSize: styleVars.fontSizes.large,
		color: readableColor(styleVars.appBackground),
		opacity: 0.7,
		textAlign: 'center'
	},
	refresh: {
		borderWidth: 1,
		borderColor: 'rgba(51,51,51,0.4)',
		borderRadius: 3,
		paddingVertical: styleVars.spacing.tight,
		paddingHorizontal: styleVars.spacing.wide,
		marginTop: styleVars.spacing.wide
	},
	refreshText: {
		color: readableColor(styleVars.appBackground),
		opacity: 0.7,
		fontSize: styleVars.fontSizes.standard,
		textAlign: 'center'
	},
	errorCode: {
		fontSize: styleVars.fontSizes.small,
		color: readableColor(styleVars.appBackground),
		opacity: 0.5,
		marginTop: styleVars.spacing.standard
	}
});