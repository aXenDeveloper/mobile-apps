import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import ViewMeasure from "./ViewMeasure";
import { styleVars } from "../styles";

export default class UnreadBar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ViewMeasure style={styles.wrapper} onLayout={this.props.onLayout} id="unread">
				<Text style={styles.text}>{this.props.label.toUpperCase()}</Text>
			</ViewMeasure>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		marginHorizontal: 12,
		marginBottom: 27,
		marginTop: 20,
		height: 1,
		borderRadius: 5,
		backgroundColor: "#9da5ad"
	},
	text: {
		fontSize: 10,
		fontWeight: "500",
		backgroundColor: styleVars.appBackground,
		color: "#9da5ad",
		//paddingHorizontal: 9,
		//width: 120,
		textAlign: "center",
		position: "absolute",
		/*left: '50%',
		marginLeft: -60,*/
		paddingRight: 9,
		left: 0,
		top: -5
	}
});

UnreadBar.defaultProps = {
	label: "Unread Comments"
};

UnreadBar.propTypes = {
	label: PropTypes.string
};
