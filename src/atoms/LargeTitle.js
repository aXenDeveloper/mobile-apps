import React, { memo } from "react";
import { Text, Image, View, StyleSheet, Platform } from "react-native";

import styles, { styleVars } from "../styles";

const LargeTitle = props => (
	<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyStart, styles.mhWide, styles.mtVeryWide, styles.mbWide, componentStyles.wrapper]}>
		<Text style={[styles.largeTitle, componentStyles.largeTitle]}>{props.children}</Text>
	</View>
);

export default memo(LargeTitle);

const componentStyles = StyleSheet.create({});
