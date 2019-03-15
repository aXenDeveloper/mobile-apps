import React, { Component } from "react";
import { StyleSheet, StatusBar, ActivityIndicator, View, Text, Image } from "react-native";

import Button from "./Button";
import styles from "../styles";

const AppLoading = props => (
	<View style={[styles.flex, styles.flexAlignCenter, styles.flexJustifyCenter, componentStyles.wrapper]}>
		<StatusBar barStyle="light-content" />
		{props.loading && <ActivityIndicator size="large" color="#ffffff" style={styles.mbStandard} />}
		{props.icon && <Image source={props.icon} resizeMode="contain" style={[componentStyles.icon, styles.mbExtraWide]} />}
		{props.title && <Text style={[styles.reverseText, styles.mediumText, styles.extraLargeText]}>{props.title}</Text>}
		{props.message && (
			<Text style={[styles.reverseText, styles.contentText, styles.mtVeryTight, styles.centerText, componentStyles.message]}>{props.message}</Text>
		)}
		{props.children && <View style={[styles.mvVeryWide, styles.mhWide]}>{props.children}</View>}
		{props.buttonText && props.buttonOnPress && (
			<Button
				filled
				rounded
				large
				type="light"
				title={props.buttonText}
				fullWidth={false}
				onPress={props.buttonOnPress}
				style={[styles.mtExtraWide, componentStyles.button]}
			/>
		)}
	</View>
);

export default AppLoading;

const componentStyles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#222"
	},
	message: {
		maxWidth: "75%"
	},
	button: {
		minWidth: "50%"
	},
	icon: {
		width: 60,
		height: 60,
		tintColor: "#fff",
		opacity: 0.3
	},
	tryAgainText: {
		color: "rgba(255,255,255,0.5)",
		fontSize: 15
	}
});
