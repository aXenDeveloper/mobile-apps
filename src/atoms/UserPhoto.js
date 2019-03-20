import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import _ from "underscore";
import Image from "react-native-remote-svg";

import getImageUrl from "../utils/getImageUrl";
import { styleVars } from "../styles";

export default class UserPhoto extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const size = this.props.size || 40;

		const photoSize = {
			width: size,
			height: size
		};

		const wrap = {
			borderRadius: size / 2,
			overflow: "hidden"
		};

		return (
			<View style={this.props.style || null}>
				<View style={wrap}>
					<Image
						source={{ uri: getImageUrl(unescape(this.props.url)) }}
						style={[photoSize, componentStyles.photo, !_.isUndefined(this.props.anon) && this.props.anon ? componentStyles.anonymous : null]}
						resizeMode="cover"
						testId="userPhoto"
					/>
				</View>
				{_.isBoolean(this.props.online) && (
					<View
						testId="onlineIndicator"
						style={[
							componentStyles.onlineBubble,
							{
								backgroundColor: this.props.online ? styleVars.positive : styleVars.negative
							}
						]}
					/>
				)}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	photo: {
		backgroundColor: "#f0f0f0"
	},
	anonymous: {
		opacity: 0.3
	},
	onlineBubble: {
		position: "absolute",
		bottom: -2,
		right: -2,
		width: 12,
		height: 12,
		borderRadius: 12,
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: "#fff"
	}
});
