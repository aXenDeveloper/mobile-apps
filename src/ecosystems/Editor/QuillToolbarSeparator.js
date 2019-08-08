import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

const QuillToolbarSeparator = props => <View style={sepStyles.sep} />;

export default QuillToolbarSeparator;

const sepStyles = StyleSheet.create({
	sep: {
		width: 6,
		height: 24,
		borderRightWidth: 1,
		borderRightColor: "#c7c7c7"
	}
});
