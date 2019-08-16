import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";

import styles, { styleVars } from "../../styles";

const NavItem = props => (
	<TouchableOpacity style={[styles.mlStandard, styles.lightBackground, styles.phWide, styles.pvStandard, componentStyles.navItem]} onPress={props.onPress}>
		<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyCenter]}>
			<Image source={props.icon} resizeMode="contain" style={[styles.mrTight, componentStyles.navItemIcon]} />
			<Text style={[styles.smallText, styles.mediumText, styles.standardText, componentStyles.navItemText]} allowFontScaling={false}>
				{props.title}
			</Text>
		</View>
	</TouchableOpacity>
);

export default NavItem;

const componentStyles = StyleSheet.create({
	navItem: {
		borderRadius: 30
	},
	navItemText: {
		color: styleVars.tabActive,
		marginTop: -1
	},
	navItemIcon: {
		width: 14,
		height: 14,
		tintColor: styleVars.tabActive
	}
});
