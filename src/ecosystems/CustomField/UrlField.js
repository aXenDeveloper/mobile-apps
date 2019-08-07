import React from "react";
import { Text, TouchableOpacity } from "react-native";
import isURL from "validator/lib/isURL";

import Lang from "../../utils/Lang";
import NavigationService from "../../utils/NavigationService";

const UrlField = props => {
	if (props.value.trim() === "") {
		return <Text style={[props.textStyles, styles.lightText]}>{Lang.get("no_url")}</Text>;
	}

	const label = props.actualType === "Upload" ? "Tap to download" : props.value;

	return (
		<TouchableOpacity onPress={isURL(props.value) ? () => NavigationService.navigate(props.value, {}, { forceBrowser: true }) : null}>
			<Text style={props.textStyles}>{label}</Text>
		</TouchableOpacity>
	);
};

export default UrlField;
