import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import ViewMeasure from "./ViewMeasure";
import styles, { styleVars } from "../styles";

export default class LoadMoreComments extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ViewMeasure style={[styles.flexRow, styles.flexAlignCenter, styles.mhStandard, styles.mtStandard, styles.mbTight]} onLayout={this.props.onLayout} id='loadMoreComments'>
				<TouchableOpacity
					style={[styles.phWide, styles.pvStandard, styles.flexGrow, componentStyles.button]}
					onPress={!this.props.loading ? this.props.onPress : null}
				>
					<Text style={[styles.centerText, styles.smallText, componentStyles.buttonText, this.props.loading ? componentStyles.loadingText : null]}>
						{this.props.loading ? "Loading..." : this.props.label}
					</Text>
				</TouchableOpacity>
			</ViewMeasure>
		);
	}
}

const componentStyles = StyleSheet.create({
	button: {
		backgroundColor: '#fff',
		borderRadius: 4
	},
	loadingText: {
		color: "rgba(0,0,0,0.3)"
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
