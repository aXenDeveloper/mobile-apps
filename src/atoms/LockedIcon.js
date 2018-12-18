import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';

import icons from "../icons";

const LockedIcon = (props) => (
	 <Image style={[props.style, componentStyles.icon]} resizeMode='stretch' source={icons.LOCKED} />
);

export default LockedIcon;

const componentStyles = StyleSheet.create({
	icon: {
		width: 14,
		height: 14,
	}
});