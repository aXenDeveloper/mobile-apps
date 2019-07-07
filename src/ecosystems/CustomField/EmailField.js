import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";

import NavigationService from "../../utils/NavigationService";

function isEmail(str) {
	const pattern = new RegExp(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
	return pattern.test(str);
}

const EmailField = props => {
	if (props.value.trim() === "") {
		return <Text style={[props.textStyles, styles.lightText]}>No Email</Text>;
	}

	return (
		<TouchableOpacity onPress={isEmail(props.value) ? () => Linking.openURL(`mailto:${props.value}`) : null}>
			<Text style={props.textStyles}>{props.value}</Text>
		</TouchableOpacity>
	);
};

export default EmailField;
