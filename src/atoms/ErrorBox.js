import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { readableColor } from "polished";

import Lang from "../utils/Lang";
import styles, { styleVars } from "../styles";

const ErrorBox = props => (
	<View style={[componentStyles.wrapper, props.transparent ? componentStyles.transparent : null, props.style]}>
		{props.showIcon !== false && <Image source={require("../../resources/error.png")} style={componentStyles.icon} />}
		<Text style={componentStyles.message}>{props.message ? props.message : Lang.get("error_loading")}</Text>
		{Boolean(props.refresh) && (
			<TouchableOpacity onPress={props.refresh} style={componentStyles.refresh}>
				<Text style={componentStyles.refreshText}>{Lang.get("try_again")}</Text>
			</TouchableOpacity>
		)}
		{Boolean(props.errorCode) && <Text style={componentStyles.errorCode}>Code {props.errorCode}</Text>}
	</View>
);

export default memo(ErrorBox);

const componentStyles = StyleSheet.create({
	wrapper: {
		backgroundColor: styleVars.appBackground,
		padding: styleVars.spacing.wide,
		margin: styleVars.spacing.wide,
		display: "flex",
		alignItems: "center"
	},
	transparent: {
		backgroundColor: "transparent"
	},
	icon: {
		width: 30,
		height: 30,
		tintColor: readableColor(styleVars.appBackground),
		opacity: 0.3,
		marginBottom: styleVars.spacing.wide
	},
	message: {
		fontSize: styleVars.fontSizes.large,
		color: readableColor(styleVars.appBackground),
		opacity: 0.7,
		textAlign: "center"
	},
	refresh: {
		borderWidth: 1,
		borderColor: "rgba(51,51,51,0.4)",
		borderRadius: 3,
		paddingVertical: styleVars.spacing.tight,
		paddingHorizontal: styleVars.spacing.wide,
		marginTop: styleVars.spacing.wide
	},
	refreshText: {
		color: readableColor(styleVars.appBackground),
		opacity: 0.7,
		fontSize: styleVars.fontSizes.standard,
		textAlign: "center"
	},
	errorCode: {
		fontSize: styleVars.fontSizes.small,
		color: readableColor(styleVars.appBackground),
		opacity: 0.5,
		marginTop: styleVars.spacing.standard
	}
});
