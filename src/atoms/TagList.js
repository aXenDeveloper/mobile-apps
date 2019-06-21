import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class TagList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={[styles.tagList, this.props.centered ? { justifyContent: "center" } : null, this.props.style]}>{this.props.children}</View>;
	}
}

const styles = StyleSheet.create({
	tagList: {
		flexWrap: "wrap",
		alignItems: "center",
		flexDirection: "row"
	}
});
