import React, { memo } from "react";
import { Text, StyleSheet } from "react-native";

import { styleVars } from "../styles";

const SectionHeader = props => <Text style={styles.sectionHeader}>{props.title.toUpperCase()}</Text>;

export default memo(SectionHeader);

const styles = StyleSheet.create({
	sectionHeader: {
		fontSize: 13,
		color: "#6D6D72", // @todo style
		backgroundColor: styleVars.appBackground,
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.standard
	}
});
