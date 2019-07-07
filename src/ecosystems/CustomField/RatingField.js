import React from "react";
import { Text, Image, StyleSheet, View } from "react-native";
import _ from "underscore";

import styles, { styleVars } from "../../styles";
import icons from "../../icons";

const RatingField = props => {
	const rating = Math.round(parseInt(props.value.value) * 2) / 2;
	const stars = _.range(1, props.value.max + 1);

	return (
		<View style={[styles.flexRow, styles.flexAlignStart]}>
			{stars.map(i => {
				if (i <= rating) {
					return <Image source={icons.STAR_SOLID} style={[styles.mrVeryTight, componentStyles.star]} resizeMode="contain" />;
				} else if (i - 0.5 <= rating) {
					return <Image source={icons.STAR_HALF_SOLID} style={[styles.mrVeryTight, componentStyles.star]} resizeMode="contain" />;
				} else {
					return <Image source={icons.STAR} style={[styles.mrVeryTight, componentStyles.star]} resizeMode="contain" />;
				}
			})}
		</View>
	);
};

export default RatingField;

const componentStyles = StyleSheet.create({
	star: {
		width: 20,
		height: 20,
		tintColor: styleVars.accentColor
	}
});
