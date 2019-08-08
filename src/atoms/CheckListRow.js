import React, { memo } from "react";
import { Text, View, Image, Switch, StyleSheet, TouchableHighlight } from "react-native";
import _ from "underscore";

import Lang from "../utils/Lang";
import styles, { styleVars } from "../styles";
import icons from "../icons";

const CheckListRow = props => (
	<TouchableHighlight onPress={props.onPress || null}>
		<View style={[styles.row, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyBetween, styles.phWide, styles.pvStandard]}>
			<View>
				{_.isString(props.title) ? <Text style={[styles.text, styles.contentText]}>{props.title}</Text> : props.title}
				{props.subText && <Text style={[styles.lightText, styles.smallText]}>{props.subText}</Text>}
			</View>
			<Image source={props.checked ? icons.CHECKMARK : null} style={componentStyles.check} resizeMode="cover" />
		</View>
	</TouchableHighlight>
);

export default memo(CheckListRow);

const componentStyles = StyleSheet.create({
	check: {
		width: 16,
		height: 13,
		tintColor: styleVars.checkmarkColor
	}
});
