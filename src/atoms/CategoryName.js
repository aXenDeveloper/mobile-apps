import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import styles, { styleVars } from "../styles";

const CategoryName = (props) => {
    const colorIndicator = props.color ? { backgroundColor: props.color } : null;

	return (
		<View style={[styles.flexRow, styles.flexAlignCenter, props.style]}>
            {props.showColor && (
                <View style={[componentStyles.colorIndicator, styles.mrVeryTight, colorIndicator]}></View>
            )}
			<Text style={[styles.smallText, styles.text, componentStyles.categoryTitle]} numberOfLines={1}>{props.name}</Text>
		</View>
	);
}

export default CategoryName;

const componentStyles = StyleSheet.create({
	colorIndicator: {
        width: 9,
        height: 9,
        borderRadius: 2,
        backgroundColor: styleVars.accentColor
    },
    categoryTitle: {

    }
});