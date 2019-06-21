import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { styleVars } from "../styles";

export default class ShadowedArea extends Component {
	constructor(props) {
		super(props);
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		const { style, children, ...props } = this.props;

		return (
			<View ref={component => (this._root = component)} style={[styles.shadowedArea, style]} {...props}>
				{children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	shadowedArea: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: styleVars.borderColors.medium
		/*shadowColor: '#C8C7CC',
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.4,
		shadowRadius: 6*/
	}
});
