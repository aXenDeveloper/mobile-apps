import React, { memo } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { compose } from "react-apollo";
import { withNavigation } from "react-navigation";
import _ from "underscore";

import NavigationService from "../../utils/NavigationService";
import styles, { styleVars } from "../../styles";

const onPress = (id, name) => {
	NavigationService.navigateToScreen("Profile", {
		id,
		name
	});
};

const Mention = props => (
	<Text style={props.baseFontStyle}>
		<Text> </Text>
		<Text
			onPress={() => onPress(props.userid, props.name)}
			style={[componentStyles.mentionWrapper, componentStyles.mention, styles.smallText, styles.phVeryTight]}
		>
			{" "}
			{props.name}{" "}
		</Text>
		<Text> </Text>
	</Text>
);

export default memo(Mention);

const componentStyles = StyleSheet.create({
	mentionWrapper: {
		backgroundColor: styleVars.accentColor,
		borderRadius: 3,
		paddingVertical: 2
	},
	mention: {
		color: styleVars.reverseText,
		includeFontPadding: false,
		textAlignVertical: "center"
	}
});
