import React, { memo } from "react";
import { StatusBar, Platform } from "react-native";
import { Header } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";

import { withTheme } from "../../themes";
import { isIphoneX } from "../../utils/isIphoneX";

const CustomHeader = props => {
	const { styleVars, componentStyles } = props;
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
			<StatusBar barStyle={styleVars.statusBarStyle} translucent />
			{content}
		</LinearGradient>
	);
};

const _componentStyles = {
	headerWrap: {
		height: Platform.OS === "ios" ? (isIphoneX() ? 96 : 76) : 82,
		overflow: "visible"
	}
};

export default withTheme(_componentStyles)(memo(CustomHeader));
