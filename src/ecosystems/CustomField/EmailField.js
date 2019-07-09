import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import isEmail from "validator/lib/isEmail";

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
