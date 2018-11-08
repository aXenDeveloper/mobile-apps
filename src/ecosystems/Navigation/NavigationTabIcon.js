import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import styles, { styleVars } from "../../styles";

const NavigationTabIcon = (props) => {	
	return (
		<View>
			<Image
				style={[styles.tabIcon, { tintColor: props.tintColor }]}
				source={props.focused ? props.active : props.inactive}
			/>
			{props.children}
		</View>
	);
}

export default NavigationTabIcon;