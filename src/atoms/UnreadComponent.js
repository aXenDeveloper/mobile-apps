import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { styleVars } from '../styles';

const UnreadComponent = (props) => {
	return props.active ? <View style={[componentStyles.unreadIndicator, props.style]}></View> : null
};

export default UnreadComponent;

const componentStyles = StyleSheet.create({
	unreadIndicator: {
		width: 0,
		height: 0,
		borderWidth: 8,
		borderRightColor: styleVars.unread,
		borderLeftColor: 'transparent',
		borderBottomColor: 'transparent',
		borderTopColor: 'transparent',
		position: 'absolute',
		transform: [ { rotate: '45deg' } ],
		top: -8,
		left: -8
	}
});