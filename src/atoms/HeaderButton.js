import React, { Component } from "react";
import { Text, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import _ from "underscore";

import styles, { styleVars } from "../styles";
import icons from "../icons";

const HeaderButton = props => {
	let showIcon = false;
	let showLabel = false;

	if (props.icon) {
		if (Platform.OS === "android" || props.alwaysShowIcon || !props.label) {
			showIcon = true;
		}
	}

	if (props.label) {
		if (Platform.OS === "ios" || !props.icon) {
			showLabel = true;
		}
	}

	return (
		<TouchableOpacity style={[componentStyles.wrapper, props.position == "left" ? styles.mlWide : styles.mrWide, props.style]} onPress={props.onPress || null}>
			{showIcon && (
				<Image source={props.icon} style={[styles.headerIcon, props.size ? { width: props.size, height: props.size } : componentStyles.defaultSize]} />
			)}
			{showLabel && <Text style={[styles.headerTitle]}>{props.label}</Text>}
		</TouchableOpacity>
	);
};

export default HeaderButton;

const componentStyles = StyleSheet.create({
	defaultSize: {
		...Platform.select({
			ios: {
				width: 26,
				height: 26
			},
			android: {
				width: 22,
				height: 22
			}
		})
	}
});
