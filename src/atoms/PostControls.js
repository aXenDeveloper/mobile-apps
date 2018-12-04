import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import styles, { styleVars } from '../styles';

const PostControls = (props) => {
	return (
		<View style={[styles.flexRow, styles.flexGrow, styles.flexAlignStretch, styles.flexJustifyCenter, componentStyles.postControls, props.style]}>
			{props.children}
		</View>
	);
}

export default PostControls;

const componentStyles = StyleSheet.create({
	postControls: {
		borderTopWidth: 1,
		borderTopColor: styleVars.borderColors.medium
	}
});