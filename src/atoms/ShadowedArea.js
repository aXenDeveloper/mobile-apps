import React, { PureComponent } from "react";
import { View, StyleSheet, Image } from "react-native";
import styles, { styleVars } from "../styles";

export default class ShadowedArea extends PureComponent {
	constructor(props) {
		super(props);
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		const { style, hidden, children, ...props } = this.props;

		return (
			<View ref={component => (this._root = component)} style={[componentStyles.shadowedArea, hidden && styles.moderatedBackground, style]} {...props}>
				{children}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
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
