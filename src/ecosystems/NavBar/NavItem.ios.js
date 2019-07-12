import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";

import styles, { styleVars } from "../../styles";

const NavItem = props => (
	<TouchableOpacity style={componentStyles.navItem} onPress={props.onPress}>
		<View style={[styles.flexRow, styles.flexAlignCenter, styles.phWide, styles.pvStandard, styles.mlStandard]}>
			<Image source={props.icon} resizeMode="contain" style={[styles.mrTight, componentStyles.navItemIcon]} />
			<Text style={[styles.smallText, styles.mediumText, componentStyles.navItemText]}>{props.title}</Text>
		</View>
	</TouchableOpacity>
);

export default NavItem;

const componentStyles = StyleSheet.create({
	navItem: {
		backgroundColor: "#F5F5F5",
		borderRadius: 30
	},
	navItemText: {
		lineHeight: 13,
		color: styleVars.tabActive
	},
	navItemIcon: {
		width: 14,
		height: 14,
		tintColor: styleVars.tabActive,
		marginTop: -1
	}
});
