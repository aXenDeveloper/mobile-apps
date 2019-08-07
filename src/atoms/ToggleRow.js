import React, { memo } from "react";
import { Text, View, Image, Switch, StyleSheet, TouchableOpacity } from "react-native";
import _ from "underscore";

import Lang from "../utils/Lang";
import styles, { styleVars } from "../styles";

const ToggleRow = props => (
	<View style={[styles.row, props.lastRow && styles.lastRow, componentStyles.menuItemWrap]}>
		<View style={componentStyles.menuItem}>
			<Text style={[styles.text, styles.contentText]}>{props.title}</Text>
			{Boolean(props.subText) && <Text style={componentStyles.metaText}>{props.subText}</Text>}
		</View>
		<Switch
			trackColor={{ true: styleVars.toggleTint }}
			value={props.value}
			disabled={!_.isUndefined(props.enabled) ? !props.enabled : false}
			style={componentStyles.switch}
			onValueChange={props.onToggle || null}
		/>
	</View>
);

export default memo(ToggleRow);

const componentStyles = StyleSheet.create({
	menuItemWrap: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: styleVars.spacing.standard,
		paddingHorizontal: styleVars.spacing.wide
	},
	icon: {
		width: 24,
		height: 24,
		tintColor: styleVars.lightText,
		marginRight: 12
	},
	menuItem: {
		flex: 1
	},
	metaText: {
		color: styleVars.veryLightText,
		fontSize: 12
	},
	switch: {
		marginLeft: styleVars.spacing.standard
	}
});
