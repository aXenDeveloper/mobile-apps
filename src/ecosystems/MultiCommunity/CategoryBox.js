import React, { Component } from "react";
import { Text, View, Image, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import FadeIn from "react-native-fade-in-image";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { setActiveCommunity } from "../../redux/actions/app";
import parseUri from "../../utils/parseUri";
import Lang from "../../utils/Lang";
import ShadowedArea from "../../atoms/ShadowedArea";
import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import styles, { styleVars, categoryStyles } from "../../styles";
import { categoryIcons } from "../../icons";

const backgroundImages = {
	_default: require("../../../resources/category_images/general.jpg"),
	auto: require("../../../resources/category_images/automotive.jpg"),
	finance: require("../../../resources/category_images/finance.jpg"),
	education: require("../../../resources/category_images/education.jpg"),
	entertainment: require("../../../resources/category_images/entertainment.jpg"),
	gaming: require("../../../resources/category_images/gaming.jpg"),
	general: require("../../../resources/category_images/general.jpg"),
	hobbyist: require("../../../resources/category_images/hobbyist.jpg"),
	lifestyle: require("../../../resources/category_images/lifestyle.jpg"),
	local: require("../../../resources/category_images/local.jpg"),
	news: require("../../../resources/category_images/news.jpg"),
	sports: require("../../../resources/category_images/sport.jpg"),
	technology: require("../../../resources/category_images/technology.jpg")
};

const CategoryBox = props => {
	if (props.loading) {
		return (
			<ShadowedArea style={[styles.flexGrow, componentStyles.categoryBox, props.style]}>
				<PlaceholderContainer style={{ width: "100%", height: "100%" }}>
					<PlaceholderElement style={{ height: 120, width: "100%" }} />
				</PlaceholderContainer>
			</ShadowedArea>
		);
	}

	const background = !_.isUndefined(backgroundImages[props.id]) ? backgroundImages[props.id] : backgroundImages["_default"];
	const icon = !_.isUndefined(categoryIcons[props.id]) ? categoryIcons[props.id] : categoryIcons["_default"];
	const color = !_.isUndefined(categoryStyles[props.id]) ? categoryStyles[props.id] : categoryStyles["_default"];

	return (
		<ShadowedArea style={[styles.flexGrow, componentStyles.categoryBox, props.style]}>
			<TouchableOpacity style={[componentStyles.touchableBox]} onPress={props.onPress}>
				<FadeIn style={componentStyles.image}>
					<ImageBackground source={background} style={componentStyles.image} resizeMode="cover">
						<LinearGradient
							colors={["rgba(58,69,81,0.2)", "rgba(58,69,81,1)"]}
							start={[0, 0]}
							end={[1, 1]}
							style={[styles.flex, styles.flexGrow, styles.flexAlignCenter, styles.flexJustifyCenter, styles.phWide, componentStyles.innerBox]}
						>
							<Image source={icon} resizeMode="contain" style={[componentStyles.icon, styles.mbTight]} />
							<Text style={[styles.centerText, componentStyles.categoryTitle]}>{props.name}</Text>
						</LinearGradient>
					</ImageBackground>
				</FadeIn>
			</TouchableOpacity>
		</ShadowedArea>
	);
};

export default CategoryBox;

const componentStyles = StyleSheet.create({
	categoryBox: {
		height: 120,
		overflow: "hidden",
		borderRadius: 4,
		backgroundColor: "rgba(58,69,81,0.8)"
	},
	image: {
		height: "100%",
		width: "100%"
	},
	touchableBox: {
		...StyleSheet.absoluteFillObject
	},
	innerBox: {
		...StyleSheet.absoluteFillObject
	},
	icon: {
		width: 40,
		height: 40,
		tintColor: "#fff"
	},
	categoryTitle: {
		color: "#fff",
		fontWeight: "500",
		fontSize: 16
	}
});
