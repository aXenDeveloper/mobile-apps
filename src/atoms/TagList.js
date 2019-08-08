import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

const TagList = props => <View style={[styles.tagList, props.centered ? { justifyContent: "center" } : null, props.style]}>{props.children}</View>;

export default memo(TagList);

const styles = StyleSheet.create({
	tagList: {
		flexWrap: "wrap",
		alignItems: "center",
		flexDirection: "row"
	}
});
