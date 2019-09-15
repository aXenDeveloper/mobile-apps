import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { TabHeading } from "native-base";

import { withTheme } from "../themes";

const CustomTab = ({ page, onLayout, active, onPress, name, styleVars }) => {
	return (
		<TouchableOpacity key={name} onPress={() => onPress(page)} onLayout={onLayout} activeOpacity={0.4}>
			<TabHeading
				scrollable
				style={{
					backgroundColor: "transparent"
				}}
				active={active}
			>
				<Text
					style={{
						fontWeight: "500",
						color: active ? styleVars.tabBar.active : styleVars.tabBar.inactive,
						fontSize: 14
					}}
				>
					{name}
				</Text>
			</TabHeading>
		</TouchableOpacity>
	);
};

export default withTheme()(CustomTab);
