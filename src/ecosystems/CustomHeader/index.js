import React, { Component } from "react";
import { Text, View, StatusBar, SafeAreaView, TouchableHighlight, Button, StyleSheet, Platform } from "react-native";
import { Header } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";

import { isIphoneX } from "../../utils/isIphoneX";
import { styleVars } from "../../styles";

const CustomHeader = props => {
	let content;

	if (props.content) {
		content = props.content;
	} else {
		content = <Header {...props} style={componentStyles.header} />;
	}

	return (
		<LinearGradient
			start={[0, 0]}
			end={[1, 0]}
			colors={props.transparent ? ["rgba(0,0,0,0)", "rgba(0,0,0,0)"] : styleVars.primaryBrand}
			style={componentStyles.headerWrap}
		>
			<StatusBar barStyle="light-content" translucent />
			{content}
		</LinearGradient>
	);
};

export default CustomHeader;

const componentStyles = StyleSheet.create({
	headerWrap: {
		height: Platform.OS === "ios" ? (isIphoneX() ? 96 : 76) : 82,
		overflow: "visible"
	}
});
