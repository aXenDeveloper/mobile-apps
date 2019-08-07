import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import _ from "underscore";
import Image from "react-native-remote-svg";
import FadeIn from "react-native-fade-in-image";

import getImageUrl from "../utils/getImageUrl";
import { styleVars } from "../styles";

const UserPhoto = props => {
	const size = props.size || 40;

	const photoSize = {
		width: size,
		height: size
	};

	const wrap = {
		borderRadius: size / 2,
		overflow: "hidden"
	};

	return (
		<View style={props.style || null}>
			<View style={wrap}>
				<FadeIn>
					<Image
						source={{ uri: getImageUrl(unescape(props.url)) }}
						style={[photoSize, componentStyles.photo, !_.isUndefined(props.anon) && props.anon ? componentStyles.anonymous : null]}
						resizeMode="cover"
						testId="userPhoto"
					/>
				</FadeIn>
			</View>
			{_.isBoolean(props.online) && (
				<View
					testId="onlineIndicator"
					style={[
						componentStyles.onlineBubble,
						{
							backgroundColor: props.online ? styleVars.positive : styleVars.negative
						}
					]}
				/>
			)}
		</View>
	);
};

export default memo(UserPhoto);

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
