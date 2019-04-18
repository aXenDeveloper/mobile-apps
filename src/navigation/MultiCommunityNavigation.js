import React, { Component } from "react";
import {
	createAppContainer,
	createBottomTabNavigator,
	createMaterialTopTabNavigator,
	createDrawerNavigator,
	createStackNavigator,
	NavigationActions
} from "react-navigation";
import { BottomTabBar } from "react-navigation-tabs";
import { Text, View } from "react-native";
import Image from "react-native-remote-svg";
import { connect } from "react-redux";
import { LinearGradient, WebBrowser } from "expo";

// IPS Screens
import MyCommunitiesScreen from "../screens/multi/MyCommunitiesScreen";
import MultiCategoryListScreen from "../screens/multi/MultiCategoryListScreen";
import MultiCategoryScreen from "../screens/multi/MultiCategoryScreen";

//import BrowserModal from "../ecosystems/BrowserModal";
import NavigationService from "../utils/NavigationService";
import { resetModalWebview } from "../redux/actions/app";
import { NavigationTabIcon, NavigationTabNotification } from "../ecosystems/Navigation";
import CustomHeader from "../ecosystems/CustomHeader";
import styles, { styleVars, tabStyles } from "../styles";
import icons from "../icons";
import Lang from "../utils/Lang";

export default class MultiCommunityNavigation extends Component {
	constructor(props) {
		super(props);

		const TabNavigator = createBottomTabNavigator(
			{
				MultiHome: {
					screen: createStackNavigator(
						{
							Home: {
								screen: MyCommunitiesScreen
							}
						},
						{
							cardStyle: styles.stackCardStyle,
							defaultNavigationOptions: {
								header: props => {
									return <CustomHeader {...props} />;
								},
								headerTitleStyle: styles.headerTitle,
								headerStyle: styles.header,
								headerBackTitleStyle: styles.headerBack,
								headerTintColor: "white",
								headerBackTitle: null
							}
						}
					),
					navigationOptions: {
						tabBarLabel: "My Communities",
						header: props => {
							return <CustomHeader {...props} title="My Communities" />;
						},
						tabBarIcon: props => <NavigationTabIcon {...props} active={icons.MULTI_MINE_SOLID} inactive={icons.MULTI_MINE} />
					}
				},
				MultiCategory: {
					screen: createStackNavigator(
						{
							List: {
								screen: MultiCategoryListScreen
							},
							Category: {
								screen: MultiCategoryScreen
							}
						},
						{
							cardStyle: styles.stackCardStyle,
							defaultNavigationOptions: {
								header: props => {
									return <CustomHeader {...props} />;
								},
								headerTitleStyle: styles.headerTitle,
								headerStyle: styles.header,
								headerBackTitleStyle: styles.headerBack,
								headerTintColor: "white",
								headerBackTitle: null
							}
						}
					),
					navigationOptions: {
						tabBarLabel: "Discover",
						header: props => {
							return <CustomHeader {...props} title="Discover Communities" />;
						},
						tabBarIcon: props => <NavigationTabIcon {...props} active={icons.MULTI_BROWSE_SOLID} inactive={icons.MULTI_BROWSE} />
					}
				},
				MultiSettings: {
					screen: createStackNavigator(
						{
							Category: {
								screen: MultiCategoryListScreen
							}
						},
						{
							cardStyle: styles.stackCardStyle,
							defaultNavigationOptions: {
								header: props => {
									return <CustomHeader {...props} />;
								},
								headerTitleStyle: styles.headerTitle,
								headerStyle: styles.header,
								headerBackTitleStyle: styles.headerBack,
								headerTintColor: "white",
								headerBackTitle: null
							}
						}
					),
					navigationOptions: {
						tabBarLabel: "Preferences",
						header: props => {
							return <CustomHeader {...props} title="Forums" />;
						},
						tabBarIcon: props => <NavigationTabIcon {...props} active={icons.MULTI_SETTINGS_SOLID} inactive={icons.MULTI_SETTINGS} />
					}
				}
			},
			{
				lazy: true,
				tabBarPosition: "bottom",
				tabBarOptions: {
					showLabel: true,
					inactiveTintColor: styleVars.tabInactive,
					activeTintColor: styleVars.tabActive,
					style: styles.primaryTabBar
				}
			}
		);

		this.AppContainer = createAppContainer(TabNavigator);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<this.AppContainer />
			</View>
		);
	}
}
