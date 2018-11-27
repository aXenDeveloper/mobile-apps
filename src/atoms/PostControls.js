import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import styles, { styleVars } from '../styles';

export default class PostControls extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		if( !this.props.children.length ){
			return null;
		}

		return (
			<View style={[styles.flexRow, styles.flexAlignStretch, styles.flexJustifyCenter, componentStyles.postControls, this.props.style]}>
				{this.props.children}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	postControls: {
		borderTopWidth: 1,
		borderTopColor: styleVars.borderColors.medium,
	}
});