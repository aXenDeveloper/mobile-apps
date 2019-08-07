import React, { memo } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import ViewMeasure from "./ViewMeasure";
import Lang from "../utils/Lang";
import styles, { styleVars } from "../styles";

const LoadMoreComments = ({ label = Lang.get("load_earlier_comments"), ...props }) => (
	<ViewMeasure
		style={[styles.flexRow, styles.flexAlignCenter, styles.mhStandard, styles.mtStandard, styles.mbTight]}
		onLayout={props.onLayout}
		id="loadMoreComments"
	>
		<TouchableOpacity style={[styles.phWide, styles.pvStandard, styles.flexGrow, componentStyles.button]} onPress={!props.loading ? props.onPress : null}>
			<Text style={[styles.centerText, styles.smallText, componentStyles.buttonText, props.loading ? componentStyles.loadingText : null]}>
				{props.loading ? `${Lang.get("loading")}...` : label}
			</Text>
		</TouchableOpacity>
	</ViewMeasure>
);

export default memo(LoadMoreComments);

const componentStyles = StyleSheet.create({
	button: {
		backgroundColor: "#fff",
		borderRadius: 4
	},
	loadingText: {
		color: "rgba(0,0,0,0.3)"
	}
});
