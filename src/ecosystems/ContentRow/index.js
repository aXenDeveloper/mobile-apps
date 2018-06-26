import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import ShadowedArea from "../../atoms/ShadowedArea";
import styles from '../../styles.js';

const stylesheet = StyleSheet.create({
	outerContentRow: {
		marginBottom: 1
	},
	outerContentRowWithSpace: {
		marginBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.05)'
	}
});

const ContentRow = props => {
	const rowClass = props.unread
		? styles.unreadBackground
		: styles.readBackground;

	return (
		<TouchableHighlight
			style={props.withSpace ? stylesheet.outerContentRowWithSpace : stylesheet.outerContentRow}
			onPress={props.onPress || null}
		>
			<View style={[stylesheet.innerContentRow, rowClass]}>
				{props.children}
			</View>
		</TouchableHighlight>
	);
};

export default ContentRow;