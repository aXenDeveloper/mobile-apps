import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import _ from "underscore";

import getImageUrl from "../utils/getImageUrl";
import styles, { styleVars } from "../styles";

export default class PostControl extends Component {
	constructor(props) {
		super(props);
	}

	getIcon() {
		let image;

		if (!this.props.image) {
			return null;
		}

		if (_.isString(this.props.image)) {
			return <Image source={{ uri: getImageUrl(this.props.image) }} style={componentStyles.image} resizeMode="contain" />;
		}

		return <Image source={this.props.image} style={[componentStyles.image, componentStyles.icon]} resizeMode="contain" />;
	}

	render() {
		return (
			<TouchableOpacity
				style={[styles.flex, styles.pvVeryTight, this.props.style]}
				onLongPress={this.props.onLongPress || null}
				onPress={this.props.onPress || null}
			>
				<View
					testId={this.props.testId}
					style={[styles.pvTight, styles.flexRow, styles.flexAlignCenter, styles.flexJustifyCenter, this.props.selected ? componentStyles.selected : null]}
				>
					{this.getIcon()}
					<Text
						style={[styles.lightText, styles.standardText, styles.mediumText, this.props.selected ? componentStyles.selectedText : null, this.props.textStyle]}
					>
						{this.props.label}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const componentStyles = StyleSheet.create({
	selected: {
		backgroundColor: "#f5f5f5",
		borderRadius: 2
	},
	image: {
		width: 18,
		height: 18,
		marginRight: 4
	},
	icon: {
		tintColor: styleVars.lightText
	},
	selectedText: {
		color: "#000"
	}
});
