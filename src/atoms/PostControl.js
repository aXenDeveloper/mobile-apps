import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import _ from "underscore";

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

		if (_.isString(this.props.image) && this.props.image.startsWith("http")) {
			image = { uri: this.props.image };
		} else {
			image = this.props.image;
		}

		if (image) {
			return <Image source={image} style={componentStyles.image} resizeMode="contain" />;
		}
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
					style={[
						styles.pvTight,
						styles.flexRow,
						styles.flexAlignCenter,
						styles.flexJustifyCenter,
						this.props.selected ? componentStyles.selected : null
					]}
				>
					{this.getIcon()}
					<Text
						style={[
							styles.lightText,
							styles.standardText,
							styles.mediumText,
							this.props.selected ? componentStyles.selectedText : null,
							this.props.textStyle
						]}
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
		marginRight: 4,
		tintColor: styleVars.lightText
	},
	selectedText: {
		color: "#000"
	}
});
