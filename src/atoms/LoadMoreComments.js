import React, { memo } from "react";
import { Text, TouchableOpacity } from "react-native";

import ViewMeasure from "./ViewMeasure";
import Lang from "../utils/Lang";
import { withTheme } from "../themes";

const LoadMoreComments = ({ label = Lang.get("load_earlier_comments"), styles, componentStyles, ...props }) => (
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

const _componentStyles = styleVars => ({
	button: {
		backgroundColor: "#fff", // @todo color
		borderRadius: 4
	},
	loadingText: {
		color: "rgba(0,0,0,0.3)" // @todo color
	}
});

export default withTheme(_componentStyles)(memo(LoadMoreComments));
