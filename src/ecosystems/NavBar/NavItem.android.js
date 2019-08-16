import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";

import styles, { styleVars } from "../../styles";

const NavItem = props => (
	<TouchableOpacity style={componentStyles.navItem} onPress={props.onPress}>
		<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyCenter, styles.pvStandard, styles.mlWide, styles.mrStandard]}>
			<Image source={props.icon} resizeMode="contain" style={[styles.mrTight, componentStyles.navItemIcon]} />
			<Text style={[styles.smallText, componentStyles.navItemText]} allowFontScaling={false}>
				{props.title}
			</Text>
		</View>
	</TouchableOpacity>
);

export default NavItem;

const componentStyles = StyleSheet.create({
	navItem: {},
	navItemText: {
		color: styleVars.tabActive,
		textTransform: "uppercase",
		fontWeight: "500"
	},
	navItemIcon: {
		width: 16,
		height: 16,
		tintColor: styleVars.tabActive
		//marginTop: -1
	}
});
