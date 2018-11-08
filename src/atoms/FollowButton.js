import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

import HeaderButton from "./HeaderButton";
import { styleVars } from '../styles';

const FollowButton = (props) => {
	let imageToUse = props.followed ? require('../../resources/bookmark_active.png') : require('../../resources/bookmark.png');

	return (
		<HeaderButton icon={imageToUse} onPress={props.onPress} style={props.style} size={props.size} />
	);
}

export default FollowButton;