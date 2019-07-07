import React from "react";
import { Text } from "react-native";

const TextField = props => {
	if (String(props.value).trim() === "") {
		return <Text style={[props.textStyles, styles.lightText]}>No value</Text>;
	}

	return <Text style={props.textStyles}>{String(props.value)}</Text>;
};

export default TextField;
