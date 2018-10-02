import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import UserPhoto from "./UserPhoto";
import ContentRow from "../ecosystems/ContentRow";
import { PlaceholderElement, PlaceholderContainer } from "../ecosystems/Placeholder";

import styles, { styleVars } from "../styles";

const MemberRow = props => {
	if (props.loading) {
		return (
			<ContentRow>
				<PlaceholderContainer height={60} style={componentStyles.loadingRow}>
					<PlaceholderElement circle radius={36} top={11} left={styleVars.spacing.standard} />
					<PlaceholderElement width={200} height={15} top={13} left={60} />
					<PlaceholderElement width={120} height={12} top={32} left={60} />
				</PlaceholderContainer>
			</ContentRow>
		);
	}

	return (
		<ContentRow style={componentStyles.row} onPress={props.onPress}>
			<UserPhoto url={props.data.photo} size={36} />
			<View style={componentStyles.container}>
				<Text style={styles.itemTitle}>{props.data.name}</Text>
				<Text style={[styles.lightText, styles.standardText]}>{props.data.group.name}</Text>
			</View>
		</ContentRow>
	);
};

export default MemberRow;

const componentStyles = StyleSheet.create({
	row: {
		display: "flex",
		flexDirection: "row",
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	container: {
		marginLeft: styleVars.spacing.standard
	}
});
