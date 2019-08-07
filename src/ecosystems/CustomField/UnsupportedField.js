import React from "react";
import { Text } from "react-native";

import Lang from "../../utils/Lang";
import styles from "../../styles";

const UnsupportedField = props => <Text style={[props.textStyles, styles.lightText]}>{Lang.get("not_available")}</Text>;

export default UnsupportedField;
