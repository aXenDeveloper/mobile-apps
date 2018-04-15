import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

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
			<View ref={component => this._root = component} style={[styles.shadowedArea, style]} {...props}>
				{children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	shadowedArea: {
		backgroundColor: '#fff',
		shadowColor: '#C8C7CC',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.6,
		shadowRadius: 3
	}
});