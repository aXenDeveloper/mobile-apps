import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import _ from "underscore";
import { styleVars } from "../../styles";

export default class PlaceholderElement extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			backgroundColor: new Animated.Value(0)
		};
	}

	componentDidMount() {
		this.state.backgroundColor.setValue(0);
		Animated.loop(
			Animated.sequence([
				Animated.timing(this.state.backgroundColor, {
					toValue: 1,
					duration: 500,
					delay: 500
				}),
				Animated.timing(this.state.backgroundColor, {
					toValue: 0,
					duration: 500
				})
			])
		).start();
	}

	render() {
		const shapeStyles = {};

		if (this.props.circle) {
			shapeStyles["width"] = this.props.radius || 30;
			shapeStyles["height"] = this.props.radius || 30;
		} else {
			shapeStyles["width"] = this.props.width || "50%";
			shapeStyles["height"] = this.props.height || 15;
		}

		["left", "right", "top", "bottom"].forEach(prop => {
			if (!_.isUndefined(this.props[prop])) {
				shapeStyles[prop] = this.props[prop];
			}
		});

		const styles = Object.assign({}, shapeStyles, this.props.style);

		// Animated background
		const backgroundColor = this.state.backgroundColor.interpolate({
			inputRange: [0, 1],
			outputRange: this.props.from ? [this.props.from, this.props.to] : styleVars.placeholderColors
		});

		return (
			<Animated.View style={[{ backgroundColor }, componentStyles.base, this.props.circle ? componentStyles.circle : componentStyles.rect, styles]}>
				<Text>&nbsp;</Text>
			</Animated.View>
		);
	}
}

const componentStyles = StyleSheet.create({
	base: {
		position: "absolute"
	},
	circle: {
		borderRadius: 150
	},
	rect: {
		borderRadius: 3
	}
});
