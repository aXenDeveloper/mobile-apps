import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import UserPhoto from './UserPhoto';
import ContentRow from '../ecosystems/ContentRow';

import styles, { styleVars } from '../styles';

const MemberRow = (props) => (
	<ContentRow style={componentStyles.row} onPress={props.onPress}>
		<UserPhoto url={props.data.photo} size={36} />
		<View style={componentStyles.container}>
			<Text style={styles.itemTitle}>{props.data.name}</Text>
			<Text style={[styles.lightText, styles.standardText]}>{props.data.group.name}</Text>
		</View>
	</ContentRow>
);

export default MemberRow;

const componentStyles = StyleSheet.create({
	row: {
		display: 'flex',
		flexDirection: 'row',
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	container: {
		marginLeft: styleVars.spacing.standard
	}
});