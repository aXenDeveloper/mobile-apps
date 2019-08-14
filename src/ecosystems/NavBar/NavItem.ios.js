import React, { memo } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";

import { withTheme } from "../../themes";

const NavItem = ({ styles, componentStyles, ...props }) => (
	<TouchableOpacity style={[styles.mlStandard, styles.lightBackground, styles.phWide, styles.pvStandard, componentStyles.navItem]} onPress={props.onPress}>
		<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyCenter]}>
			<Image source={props.icon} resizeMode="contain" style={[styles.mrTight, componentStyles.navItemIcon]} />
			<Text style={[styles.smallText, styles.mediumText, styles.standardText, componentStyles.navItemText]}>{props.title}</Text>
		</View>
	</TouchableOpacity>
);

const _componentStyles = styleVars => ({
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

export default withTheme(_componentStyles)(NavItem);
