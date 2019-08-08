import React from "react";
import { Text, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";

const ListField = props => (
	<React.Fragment>
		{Boolean(props.value.length) ? (
			props.value.map((item, idx) => (
				<Text key={idx} style={props.textStyles}>
					{item}
				</Text>
			))
		) : (
			<Text style={[props.textStyles, styles.lightText]}>{Lang.get("no_selection")}</Text>
		)}
	</React.Fragment>
);

export default ListField;
