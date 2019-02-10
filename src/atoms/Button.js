import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import { transparentize } from "polished";

import styles, { styleVars } from "../styles";

export default class Button extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const buttonStyle = this.props.filled ? "Filled" : "Outlined";
		const buttonType = this.props.type + buttonStyle;
		const textType = buttonType + "Text";
		const textSize = this.props.size + "Text";
		const rounded = this.props.rounded ? componentStyles.rounded : null;
		const imageType = buttonType + "Image";
		const colorStyle = this.props.color ? { backgroundColor: this.props.color } : null;
		const disabledStyle = this.props.disabled ? { opacity: 0.2 } : null;

		return (
			<TouchableOpacity
				style={[componentStyles.button, componentStyles[buttonType], componentStyles[this.props.size], rounded, colorStyle, disabledStyle, this.props.style]}
				onPress={!this.props.disabled ? this.props.onPress : null}
				disabled={this.props.disabled}
			>
				{Boolean(this.props.icon) && <Image style={[componentStyles.icon, componentStyles[imageType]]} resizeMode='stretch' source={this.props.icon} />}
				<View style={componentStyles.textWrapper}>
					<Text style={[componentStyles[textType], componentStyles.text, componentStyles[textSize]]} numberOfLines={1}>
						{this.props.title}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

// 

const componentStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 3
	},
	rounded: {
		borderRadius: 50
	},
	icon: {
		width: 18,
		height: 18,
		marginLeft: 0,
		marginRight: styleVars.spacing.tight
	},
	textWrapper: {
		flexGrow: 1,
	},

	// Sizes
	small: {
		paddingHorizontal: styleVars.spacing.standard,
		paddingVertical: styleVars.spacing.veryTight
	},
	medium: {
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.tight
	},
	large: {
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.standard
	},

	// Text styles
	text: {
		fontWeight: "500",
		textAlign: 'center'
	},
	smallText: {
		fontSize: styleVars.fontSizes.small
	},
	mediumText: {
		fontSize: styleVars.fontSizes.content
	},
	largeText: {
		fontSize: styleVars.fontSizes.content
	},

	// Primary button
	primaryOutlined: {
		borderWidth: 1,
		borderColor: styleVars.primaryButton.mainColor
	},
	primaryOutlinedText: {
		color: styleVars.primaryButton.mainColor
	},
	primaryOutlinedImage: {
		tintColor: styleVars.primaryButton.mainColor
	},
	primaryFilled: {
		backgroundColor: styleVars.primaryButton.mainColor
	},
	primaryFilledText: {
		color: styleVars.primaryButton.inverseColor
	},
	primaryFilledImage: {
		tintColor: styleVars.primaryButton.inverseColor
	},

	// Light button
	lightOutlined: {
		borderWidth: 1,
		borderColor: styleVars.lightButton.mainColor
	},
	lightOutlinedText: {
		color: styleVars.lightButton.mainColor
	},
	lightOutlinedImage: {
		tintColor: styleVars.lightButton.mainColor
	},
	lightFilled: {
		backgroundColor: styleVars.lightButton.mainColor
	},
	lightFilledText: {
		color: styleVars.lightButton.inverseColor
	},
	lightFilledImage: {
		tintColor: styleVars.lightButton.inverseColor
	},

	// Dark button
	darkOutlined: {
		borderWidth: 1,
		borderColor: styleVars.darkButton.mainColor
	},
	darkOutlinedText: {
		color: styleVars.darkButton.mainColor
	},
	darkOutlinedImage: {
		tintColor: styleVars.darkButton.mainColor
	},
	darkFilled: {
		backgroundColor: styleVars.darkButton.mainColor
	},
	darkFilledText: {
		color: styleVars.darkButton.inverseColor,
	},
	darkFilledImage: {
		tintColor: styleVars.darkButton.inverseColor
	},

	// Warning button
	warningOutlined: {
		borderWidth: 1,
		borderColor: styleVars.warningButton.mainColor
	},
	warningOutlinedText: {
		color: styleVars.warningButton.mainColor
	},
	warningOutlinedImage: {
		tintColor: styleVars.warningButton.mainColor
	},
	warningFilled: {
		backgroundColor: styleVars.warningButton.mainColor
	},
	warningFilledText: {
		color: styleVars.warningButton.inverseColor
	},
	warningFilledImage: {
		tintColor: styleVars.warningButton.inverseColor
	}
});

Button.defaultProps = {
	filled: false,
	size: "medium",
	type: "primary",
	onPress: null
};

Button.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.any,
	size: PropTypes.oneOf(["small", "medium", "large"]),
	type: PropTypes.oneOf(["primary", "light", "warning", "dark"]),
	onPress: PropTypes.func,
	filled: PropTypes.bool,
	style: ViewPropTypes.style
};
