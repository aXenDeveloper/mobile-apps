import React from "react";
import { Text } from "react-native";

import styles from "../../styles";

const UnsupportedField = props => <Text style={[props.textStyles, styles.lightText]}>Not available</Text>;

export default UnsupportedField;
