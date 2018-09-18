import React, { Component } from "react";
import { createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator, createStackNavigator, TabView, TabBarTop, NavigationActions } from "react-navigation";
import { Image } from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from "expo";

// ----
// Core screens
import HomeScreen from "../screens/core/HomeScreen";
import BrowseCommunityScreen from "../screens/core/BrowseCommunityScreen";
import SearchScreen from "../screens/core/SearchScreen";
import StreamsScreen from "../screens/core/StreamsScreen";
import StreamViewScreen from "../screens/core/StreamViewScreen";
import NotificationsScreen from "../screens/core/NotificationsScreen";
import NotificationsSettingsScreen from "../screens/core/NotificationsSettingsScreen";
import ProfileScreen from "../screens/core/ProfileScreen";
import UserScreen from "../screens/core/UserScreen";
import LoginScreen from "../screens/core/LoginScreen";
import WebViewScreen from "../screens/core/WebViewScreen";
import AccountSettingsScreen from "../screens/core/AccountSettings/AccountSettingsScreen";
import CommentViewSettingsScreen from "../screens/core/AccountSettings/CommentViewSettingsScreen";
// ----
// Forums screens
import ForumListScreen from "../screens/forums/ForumListScreen";
import ForumFollowedScreen from "../screens/forums/ForumFollowedScreen";
import TopicListScreen from "../screens/forums/TopicListScreen";
import TopicViewScreen from "../screens/forums/TopicViewScreen";
import CreateTopicScreen from "../screens/forums/CreateTopicScreen";
import ReplyTopicScreen from "../screens/forums/ReplyTopicScreen";

import CustomHeader from "../ecosystems/CustomHeader";
import styles, { styleVars, tabStyles } from "../styles";
import Lang from '../utils/Lang';


class AppNavigation extends Component {
	constructor(props) {
		super(props);

		this._HomeTabBar = this._getHomeTabBar();
		this._ForumTabBar = this._getForumTabBar();
		this._CommunityStack = this._getMainStack();
		this._StreamStack = this._getMainStack({}, 'StreamView');
		this._NotificationStack = this._getMainStack({}, 'NotificationsStack');

		this.state = {
			MasterNavigation: this._getMasterNavigation()
		};
	}

	_getMainStack(options, initialRoute) {
		return createStackNavigator(
			{
				HomeScreen: { 
					screen: this._HomeTabBar,
					navigationOptions: {
						title: this.props.site.board_name
					}
				},
				ForumIndex: { screen: ForumListScreen },
				TopicList: { screen: TopicListScreen },
				TopicView: { screen: TopicViewScreen },
				Profile: { screen: ProfileScreen },
				NotificationsStack: { screen: NotificationsScreen },
				NotificationsSettings: { screen: NotificationsSettingsScreen },
				AccountSettings: { 
					screen: this._getSettingsStack(),
					navigationOptions: {
						title: 'Account Settings'
					}
				},
				StreamView: { screen: StreamViewScreen }
			},
			{
				initialRouteName: initialRoute || 'HomeScreen',
				cardStyle: styles.stackCardStyle,
				navigationOptions: Object.assign({
					header: props => {
						return <CustomHeader {...props} />;
					},
					headerTitleStyle: styles.headerTitle,
					headerStyle: styles.header,
					headerBackTitleStyle: styles.headerBack,
					headerTintColor: "white",
					headerBackTitle: null
				}, options || null)
			}
		);
	}

	_getSettingsStack(options) {
		return createStackNavigator(
			{
				AccountSettingsScreen: { screen: AccountSettingsScreen },
				CommentViewSettingsScreen: { screen: CommentViewSettingsScreen }
			},
			{
				initialRouteName: 'AccountSettingsScreen',
				cardStyle: styles.stackCardStyle,
				navigationOptions: Object.assign({
					title: 'Settings',
					header: null
				}, options || null)
			}
		);
	}

	/*_getStreamStack(options, initialRoute) {
		return createStackNavigator(
			{
				StreamView: { screen: StreamViewScreen	},
			},
			{
				initialRouteName: initialRoute || 'StreamView',
				cardStyle: styles.stackCardStyle,
				navigationOptions: Object.assign({
					title: 'Streams',
					header: props => {
						return <CustomHeader {...props} title="Streams" />;
					},
					headerTitleStyle: styles.headerTitle,
					headerStyle: styles.header,
					headerBackTitleStyle: styles.headerBack,
					headerTintColor: "white",
					headerBackTitle: null
				}, options || null)
			}
		);
	}*/

	/**
	 * Return the overall master navigation component
	 *
	 * @return StackNavigator
	 */
	_getMasterNavigation() {
		const masterStack = createStackNavigator(
			{
				Root: {
					screen: this._getPrimaryTabBar(),
					navigationOptions: {
						header: null // Hide header because the tab navigator adds it
					}
				},
				CreateTopic: {
					screen: CreateTopicScreen,
					headerMode: 'float',
					navigationOptions: {
						title: "Create Topic",
					}
				},
				ReplyTopic: {
					screen: ReplyTopicScreen,
					headerMode: 'screen',
					navigationOptions: {
						title: "Reply"
					}
				},
				LoginModal: {
					screen: LoginScreen,
					navigationOptions: {
						header: null,
						headerMode: 'none'
					}
				},
				WebView: {
					screen: WebViewScreen,
				}
			},
			{
				mode: "modal",
				navigationOptions: {
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
		);

		return createDrawerNavigator({
			Master: {
				screen: masterStack
			}
		}, {
			drawerPosition: 'left',
			contentComponent: UserScreen
		});
	}

	/**
	 * Return our primary tab bar. Tabs returned depend on authentication status in props.
	 *
	 * @return TabNavigator
	 */
	_getPrimaryTabBar() {		
		const Home = {
			screen: this._CommunityStack,
			navigationOptions: {
				tabBarLabel: "Home",
				tabBarIcon: ({ focused, tintColor }) => (
					<Image
						style={[styles.tabIcon, { tintColor: tintColor }]}
						source={focused ? require("../../resources/home_active.png") : require("../../resources/home.png")}
					/>
				)
			}
		};
		const Search = {
			screen: SearchScreen,
			navigationOptions: {
				tabBarLabel: "Search",
				tabBarIcon: ({ focused, tintColor }) => (
					<Image
						style={[styles.tabIcon, { tintColor: tintColor }]}
						source={focused ? require("../../resources/search_active.png") : require("../../resources/search.png")}
					/>
				)
			}
		};
		const Streams = {
			screen: this._StreamStack,
			navigationOptions: {
				tabBarLabel: "Streams",
				header: props => {
					return <CustomHeader {...props} title="Forums" />;
				},
				tabBarIcon: ({ focused, tintColor }) => (
					<Image
						style={[styles.tabIcon, { tintColor: tintColor }]}
						source={focused ? require("../../resources/activity_active.png") : require("../../resources/activity.png")}
					/>
				)
			}
		};
		const Notifications = {
			screen: this._NotificationStack,
			navigationOptions: navigation => ({
				tabBarLabel: "Notifications",
				tabBarIcon: ({ focused, tintColor }) => (
					<Image
						style={[styles.tabIcon, { tintColor: tintColor }]}
						source={focused ? require("../../resources/notification_active.png") : require("../../resources/notification.png")}
					/>
				)
			})
		};
		const User = {
			screen: UserScreen,
			navigationOptions: navigation => ({
				tabBarLabel: "My Account",
				tabBarIcon: ({ focused, tintColor }) => (
					<Image
						style={[styles.tabIcon, this._getUserPhotoStyle(tintColor)]}
						source={this._getUserPhoto(focused)}
					/>
				),
				tabBarOnPress: (tab, jumpToIndex) => {
					navigation.navigation.openDrawer();
					//navigation.navigation.navigate("UserScreen");
				}
			})
		};
		const Login = {
			screen: UserScreen,
			navigationOptions: navigation => ({
				tabBarLabel: "Login",
				tabBarIcon: ({ focused, tintColor }) => (
					<Image
						style={[styles.tabIcon, { tintColor: tintColor }]}
						source={focused ? require("../../resources/login_active.png") : require("../../resources/login.png")}
					/>
				),
				tabBarOnPress: (tab, jumpToIndex) => {
					navigation.navigation.navigate("LoginModal");
				}
			})
		};

		let tabConfig = {
			Home,
			Search,
			Streams,
			Login
		};

		if (this.props.auth.authenticated) {
			tabConfig = {
				Home,
				Search,
				Streams,
				Notifications,
				User
			};
		}

		return createBottomTabNavigator(tabConfig, {
			lazy: true,
			tabBarPosition: "bottom",
			tabBarOptions: {
				showLabel: false,
				inactiveTintColor: styleVars.tabInactive,
				activeTintColor: styleVars.tabActive,
				style: styles.primaryTabBar
			}
		});
	}

	/**
	 * Return the tab bar for forum view
	 *
	 * @return object
	 */
	_getForumTabBar() {
		return createMaterialTopTabNavigator(
			{
				All: {
					screen: ForumListScreen,
					navigationOptions: {
						tabBarLabel: "All Forums".toUpperCase(),
					}
				},
				Followed: {
					screen: ForumFollowedScreen,
					navigationOptions: {
						tabBarLabel: "Followed Forums".toUpperCase()
					}
				}
			},
			{
				swipeEnabled: false,
				tabBarOptions: tabStyles
			}
		);
	}

	/**
	 * Return the tab bar for forum view
	 *
	 * @return object
	 */
	_getHomeTabBar() {
		return createMaterialTopTabNavigator(
			{
				All: {
					screen: HomeScreen,
					navigationOptions: {
						tabBarLabel: Lang.get('home').toUpperCase(),
					}
				},
				Followed: {
					screen: BrowseCommunityScreen,
					navigationOptions: {
						tabBarLabel: Lang.get('browse').toUpperCase()
					}
				}
			},
			{
				swipeEnabled: false,
				tabBarPosition: 'bottom',
				tabBarOptions: Object.assign({}, tabStyles, {
					tabBarPosition: 'bottom'
				})
			}
		);
	}

	/**
	 * Return a URL for the user tab bar icon. Photo if it's a member, icon if it's a guest
	 *
	 * @return object|file resource
	 */
	_getUserPhoto(focused) {		
		if( !this.props.user.isGuest && this.props.user.photo ){
			return { uri: this.props.user.photo };
		} else {
			return focused ? require("../../resources/login_active.png") : require("../../resources/login.png")
		}
	}

	/**
	 * Returns the tint color style
	 *
	 * @return object|null
	 */
	_getUserPhotoStyle(tintColor) {
		if( !this.props.user.isGuest && this.props.user.photo ){
			return styles.userTabIcon;
		} else {
			return { tintColor };
		}
	}

	/**
	 * Called after component updates with new props
	 *
	 * Update master navigation component depending on auth status
	 * We use this to show appropriate tabs to guests vs. members
	 */
	componentDidUpdate(prevProps) {
		if (this.props.auth.authenticated !== prevProps.auth.authenticated) {
			this.setState({
				MasterNavigation: this._getMasterNavigation()
			});
		}
	}

	/**
	 * Render component
	 */
	render() {
		return <this.state.MasterNavigation />;
	}
}

export default connect(state => ({
	user: state.user,
	auth: state.auth,
	site: state.site
}))(AppNavigation);
