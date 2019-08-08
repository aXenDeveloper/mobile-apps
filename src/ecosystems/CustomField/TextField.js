import React from "react";
import { Text } from "react-native";

import Lang from "../../utils/Lang";

const TextField = props => {
	if (String(props.value).trim() === "") {
		return <Text style={[props.textStyles, styles.lightText]}>{Lang.get("no_value")}</Text>;
	}

	return <Text style={props.textStyles}>{String(props.value)}</Text>;
};

export default TextField;
