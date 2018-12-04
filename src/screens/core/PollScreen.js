import React, { Component } from "react";
import { Text, View, ScrollView, SectionList, StyleSheet, Image, StatusBar, Animated, Platform, Dimensions, Alert } from "react-native";
import HeaderBackButton from "react-navigation";

import Lang from "../../utils/Lang";
import CustomHeader from "../../ecosystems/CustomHeader";
import TwoLineHeader from "../../atoms/TwoLineHeader";
import styles, { styleVars } from "../../styles";

class PollScreen extends Component {
	static navigationOptions = {
		title: "Poll"
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Text>Poll</Text>
		);
	}
}

export default PollScreen;