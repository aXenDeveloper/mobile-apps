import React, { Component } from 'react';
import { Text, View, Image, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { TabHeading } from "native-base";

import Lang from '../utils/Lang';
import styles, { styleVars } from '../styles';

const CustomTab = ({page, onLayout, active, onPress, name}) => (	
	<TouchableOpacity key={name}
		onPress={() => onPress(page)}
		onLayout={onLayout}
		activeOpacity={0.4}
	>
		<TabHeading scrollable
			style={{
				backgroundColor: "transparent",
			}}
			active={active}
		>
			<Text style={{
				fontWeight: "500",
				color: active ? styleVars.tabBar.active : styleVars.tabBar.inactive,
				fontSize: 14
			}}>
				{name}
			</Text>
		</TabHeading>
	</TouchableOpacity>
);

export default CustomTab;

const componentStyles = StyleSheet.create({
	
});