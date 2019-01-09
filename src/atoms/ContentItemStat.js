import React, { Component } from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';

import styles, { styleVars } from '../styles';

const ContentItemStat = (props) => (
	<View style={[styles.phStandard, styles.flexBasisZero, styles.flexGrow, props.style]}>
		<Text style={[styles.largeText, styles.mediumText, styles.centerText]}>{props.value}</Text>
		<Text style={[styles.tinyText, styles.lightText, styles.centerText]}>{props.name}</Text>
	</View>
);

export default ContentItemStat;