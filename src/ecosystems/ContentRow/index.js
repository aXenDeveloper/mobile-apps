import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableHighlight } from "react-native";
import ShadowedArea from "../../atoms/ShadowedArea";

import icons from "../../icons";
import styles from "../../styles";

const componentStyles = StyleSheet.create({
	outerContentRow: {
		marginBottom: 1
	},
	outerContentRowWithSpace: {
		marginBottom: 4,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.05)"
	},
	arrow: {
		width: 18,
		height: 18
	}
});

const ContentRow = props => {
	const rowClass = props.unread ? styles.unreadBackground : styles.readBackground;

	return (
		<TouchableHighlight style={props.withSpace ? componentStyles.outerContentRowWithSpace : componentStyles.outerContentRow} onPress={props.onPress || null}>
			<View style={[styles.flexRow, rowClass]}>
				<View style={[styles.flexGrow, props.style]}>{props.children}</View>
				{props.showArrow && (
					<View style={[styles.flexAlignSelfCenter, styles.mrStandard]}>
						<Image source={icons.ROW_ARROW} resizeMode="contain" style={componentStyles.arrow} />
					</View>
				)}
			</View>
		</TouchableHighlight>
	);
};

export default ContentRow;
