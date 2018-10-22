import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";

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

		return (
			<TouchableOpacity
				style={[componentStyles.button, componentStyles[buttonType], componentStyles[this.props.size], rounded, this.props.style]}
				onPress={this.props.onPress}
			>
				<React.Fragment>
					<Text style={[componentStyles[textType], componentStyles.text, componentStyles[textSize]]} numberOfLines={1}>
						{this.props.title}
					</Text>
				</React.Fragment>
			</TouchableOpacity>
		);
	}
}

// {this.props.icon &&	<Image style={componentStyles.icon} resizeMode='stretch' source={this.props.icon} />}

const componentStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5
	},
	rounded: {
		borderRadius: 50
	},
	icon: {
		width: 16,
		height: 16
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
		fontWeight: "500"
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
	primaryFilled: {
		backgroundColor: styleVars.primaryButton.mainColor
	},
	primaryFilledText: {
		color: styleVars.primaryButton.inverseColor
	},

	// Light button
	lightOutlined: {
		borderWidth: 1,
		borderColor: styleVars.lightButton.mainColor
	},
	lightOutlinedText: {
		color: styleVars.lightButton.mainColor
	},
	lightFilled: {
		backgroundColor: styleVars.lightButton.mainColor
	},
	lightFilledText: {
		color: styleVars.lightButton.inverseColor
	},

	// Warning button
	warningOutlined: {
		borderWidth: 1,
		borderColor: styleVars.warningButton.mainColor
	},
	warningOutlinedText: {
		color: styleVars.warningButton.mainColor
	},
	warningFilled: {
		backgroundColor: styleVars.warningButton.mainColor
	},
	warningFilledText: {
		color: styleVars.warningButton.inverseColor
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
	size: PropTypes.oneOf(["small", "medium", "large"]),
	type: PropTypes.oneOf(["primary", "light", "warning"]),
	onPress: PropTypes.func,
	filled: PropTypes.bool,
	style: ViewPropTypes.style
};
