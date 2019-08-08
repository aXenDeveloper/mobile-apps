import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { compose } from "react-apollo";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

import UserPhoto from "../../atoms/UserPhoto";
import ContentRow from "../../ecosystems/ContentRow";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";

import styles, { styleVars } from "../../styles";

const MentionRow = props => {
	if (props.loading) {
		return (
			<ContentRow>
				<PlaceholderContainer height={30}>
					<PlaceholderElement circle radius={18} top={8} left={styleVars.spacing.standard} />
					<PlaceholderElement width={200} height={15} top={8} left={40} />
				</PlaceholderContainer>
			</ContentRow>
		);
	}

	return (
		<ContentRow style={componentStyles.row} onPress={props.onPress}>
			<UserPhoto url={props.photo} size={18} />
			<View style={componentStyles.container}>
				<Text style={[styles.standardText]}>{props.name}</Text>
			</View>
		</ContentRow>
	);
};

export default MentionRow;

const componentStyles = StyleSheet.create({
	row: {
		display: "flex",
		flexDirection: "row",
		paddingVertical: styleVars.spacing.tight,
		paddingHorizontal: styleVars.spacing.standard
	},
	container: {
		marginLeft: styleVars.spacing.standard
	}
});
