import React from "react";
import { Text, TouchableOpacity } from "react-native";

import NavigationService from "../../utils/NavigationService";

function isURL(str) {
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return pattern.test(str);
}

const UrlField = props => {
	if (props.value.trim() === "") {
		return <Text style={[props.textStyles, styles.lightText]}>No URL</Text>;
	}

	const label = props.actualType === "Upload" ? "Tap to download" : props.value;

	return (
		<TouchableOpacity onPress={isURL(props.value) ? () => NavigationService.navigate(props.value, {}, { forceBrowser: true }) : null}>
			<Text style={props.textStyles}>{label}</Text>
		</TouchableOpacity>
	);
};

export default UrlField;
