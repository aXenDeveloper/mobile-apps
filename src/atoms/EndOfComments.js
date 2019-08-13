import React, { memo } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { withTheme } from "../themes";

const EndOfComments = props => {
	const { componentStyles } = props;
	return (
		<View style={componentStyles.wrapper}>
			<Text style={componentStyles.text}>{props.label}</Text>
		</View>
	);
};

const _componentStyles = StyleSheet.create({
	wrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: 75
	},
	text: {
		fontSize: 13,
		color: "rgba(0,0,0,0.3)" // @todo color
	}
});

export default withTheme(_componentStyles)(memo(EndOfComments));

EndOfComments.defaultProps = {
	label: "You're up to date!"
};

EndOfComments.propTypes = {
	label: PropTypes.string
};
