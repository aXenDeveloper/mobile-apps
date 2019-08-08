import React, { memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import ViewMeasure from "./ViewMeasure";
import { styleVars } from "../styles";

const UnreadBar = ({ label = Lang.get("unread_comments"), ...props }) => (
	<ViewMeasure style={styles.wrapper} onLayout={props.onLayout} id="unread">
		<Text style={styles.text}>{label.toUpperCase()}</Text>
	</ViewMeasure>
);

export default memo(UnreadBar);

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
