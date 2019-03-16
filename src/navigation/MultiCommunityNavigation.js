import React, { Component } from "react";
import { createAppContainer, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator, createStackNavigator, NavigationActions } from "react-navigation";
import { BottomTabBar } from "react-navigation-tabs";
import { Text, View } from "react-native";
import Image from "react-native-remote-svg";
import { connect } from "react-redux";
import { LinearGradient, WebBrowser } from "expo";


// IPS Screens
import MultiHomeScreen from "../screens/ips/MultiHomeScreen";
import MultiCategoryScreen from "../screens/ips/MultiCategoryScreen";

//import BrowserModal from "../ecosystems/BrowserModal";
import NavigationService from "../utils/NavigationService";
import { resetModalWebview } from "../redux/actions/app";
import { NavigationTabIcon, NavigationTabNotification } from "../ecosystems/Navigation";
import CustomHeader from "../ecosystems/CustomHeader";
import styles, { styleVars, tabStyles } from "../styles";
import Lang from '../utils/Lang';


export default class MultiCommunityNavigation extends Component {
	constructor(props) {
		super(props);
		this.AppContainer = createAppContainer(
			createStackNavigator({
				MultiHome: MultiHomeScreen,
				MultiCategory: MultiCategoryScreen
			})
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<this.AppContainer />
			</View>
		);
	}
}