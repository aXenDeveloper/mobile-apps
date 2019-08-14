import React, { memo } from "react";
import { TouchableOpacity, Image } from "react-native";

import { withTheme } from "../../themes";

const QuillToolbarButton = ({ componentStyles, ...props }) => (
	<TouchableOpacity style={[componentStyles.button, props.active ? componentStyles.activeButton : null]} onPress={props.onPress}>
		<Image source={props.icon} style={[componentStyles.image, props.active ? componentStyles.activeImage : null]} />
	</TouchableOpacity>
);

const _componentStyles = {
	button: {
		width: 34,
		height: 34,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 5,
		borderRadius: 34
	},
	activeButton: {
		backgroundColor: "#f5f5f7"
	},
	image: {
		tintColor: "#8e8e93",
		width: 20,
		height: 20
	},
	activeImage: {
		tintColor: "#000"
	}
};

export default withTheme(_componentStyles)(memo(QuillToolbarButton));
