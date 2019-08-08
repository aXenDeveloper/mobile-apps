import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

import Lang from "../../utils/Lang";
import icons from "../../icons";
import styles, { styleVars } from "../../styles";

const BooleanField = props => (
	<View style={[styles.flexRow, styles.flexAlignStart]}>
		<Image source={Boolean(props.value) ? icons.CHECKMARK2 : icons.CROSS} resizeMode="contain" style={[componentStyles.icon, styles.mrTight]} />
		<Text style={props.textStyles}>{Boolean(props.value) ? Lang.get("Yes") : Lang.get("No")}</Text>
	</View>
);

export default BooleanField;

const componentStyles = StyleSheet.create({
	icon: {
		width: 20,
		height: 20,
		tintColor: styleVars.text
	}
});
