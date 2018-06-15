import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';

export class QuillToolbarSeparator extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={sepStyles.sep}></View>
		)
	}
}

const sepStyles = StyleSheet.create({
	sep: {
		width: 6,
		height: 24,
		borderRightWidth: 1,
		borderRightColor: '#c7c7c7'
	}
});