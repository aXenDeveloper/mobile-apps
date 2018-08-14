import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { styleVars } from "../styles";

export default class EndOfComments extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={componentStyles.wrapper}>
				<Text style={componentStyles.text}>{this.props.label}</Text>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: 75
	},
	text: {
		fontSize: 13,
		color: 'rgba(0,0,0,0.3)'
	}
});

EndOfComments.defaultProps = {
	label: "You're up to date!",
};

EndOfComments.propTypes = {
	label: PropTypes.string,
};
