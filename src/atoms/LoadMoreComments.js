import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { styleVars } from "../styles";

export default class LoadMoreComments extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={componentStyles.wrapper}>
				<TouchableOpacity style={componentStyles.button} onPress={!this.props.loading ? this.props.onPress : null}>
					<Text style={[componentStyles.buttonText, this.props.loading ? componentStyles.loadingText : null]}>
						{this.props.loading ? "Loading..." : this.props.label}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		display: "flex",
		alignItems: "center",
		marginTop: 12,
		marginBottom: 8
	},
	button: {
		backgroundColor: "rgba(0,0,0,0.05)",
		paddingHorizontal: 12,
		paddingVertical: 7
	},
	buttonText: {
		fontSize: 11
	},
	loadingText: {
		color: 'rgba(0,0,0,0.3)'
	}
});

LoadMoreComments.defaultProps = {
	label: "Load Earlier Comments",
	loading: false
};

LoadMoreComments.propTypes = {
	label: PropTypes.string,
	loading: PropTypes.bool
};