import React, { memo } from "react";
import { StyleSheet, Image } from "react-native";

import icons from "../icons";

const LockedIcon = props => <Image style={[props.style, componentStyles.icon]} resizeMode="stretch" source={icons.LOCKED} />;

export default memo(LockedIcon);

const componentStyles = StyleSheet.create({
	icon: {
		width: 14,
		height: 14
	}
});
