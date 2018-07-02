import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class PlaceholderContainer extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={this.props.style || {}}>
				<View style={{ height: this.props.height || 50 }}>
					{this.props.children}
				</View>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	
});