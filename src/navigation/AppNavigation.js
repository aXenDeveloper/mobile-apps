import React, { Component } from "react";
import { TabNavigator, StackNavigator, TabView, TabBarTop, NavigationActions } from "react-navigation";
import { Text, Image } from "react-native";
import { connect } from "react-redux";
import CustomHeader from "../ecosystems/CustomHeader";
import HomeScreen from "../screens/HomeScreen";
import ForumListScreen from "../screens/ForumListScreen";
import ForumFollowedScreen from "../screens/ForumFollowedScreen";
import TopicListScreen from "../screens/TopicListScreen";
import TopicViewScreen from "../screens/TopicViewScreen";
import SearchScreen from "../screens/SearchScreen";
import StreamsScreen from "../screens/StreamsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import CreateTopicScreen from "../screens/CreateTopicScreen";
import ReplyTopicScreen from "../screens/ReplyTopicScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserScreen from "../screens/UserScreen";
import LoginScreen from "../screens/LoginScreen";
import styles, { styleVars } from "../styles";

class AppNavigation extends Component {
	constructor(props) {
		super(props);

		this._ForumTabBar = TabNavigator(
			{
				All: {
					screen: ForumListScreen,
					navigationOptions: {
						tabBarLabel: "All Forums".toUpperCase()
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
				tabBarPosition: "top",
				tabBarOptions: {
					upperCaseLabel: true,
					showIcon: false,
					activeTintColor: "#2080A7",
					iconStyle: {
						height: 0,
						width: 0,
						padding: 0
					},
					labelStyle: {
						fontSize: 13,
						fontWeight: "500",
						padding: 0,
						margin: 0
					},
					style: {
						padding: 0,
						margin: 0,
						display: "flex",
						justifyContent: "center"
					},
					tabStyle: {
						padding: 0,
						display: "flex",
						justifyContent: "center"
					}
				}
			}
		);

		this._CommunityStack = this._getMainStack();
		this._NotificationStack = this._getMainStack({}, 'NotificationsStack');

		this.state = {
			MasterNavigation: this._getMasterNavigation()
		};
	}

	_getMainStack(options, initialRoute) {
		return StackNavigator(
			{
				ForumIndex: {
					screen: this._ForumTabBar
				},
				TopicList: { screen: TopicListScreen },
				TopicView: { screen: TopicViewScreen },
				Profile: { screen: ProfileScreen },
				NotificationsStack: { screen: NotificationsScreen }
			},
			{
				initialRouteName: initialRoute || 'ForumIndex',
				cardStyle: styles.stackCardStyle,
				navigationOptions: Object.assign({
					header: props => {
						return <CustomHeader {...props} title="Forums" />;
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

	/**
	 * Return the overall master navigation component
	 *
	 * @return StackNavigator
	 */
	_getMasterNavigation() {
		return StackNavigator(
			{
				Root: {
					screen: this._getPrimaryTabBar(),
					navigationOptions: {
						header: false
					}
				},
				CreateTopic: {
					screen: CreateTopicScreen
				},
				ReplyTopic: {
					screen: ReplyTopicScreen
				},
				LoginModal: {
					screen: LoginScreen,
					navigationOptions: {
						header: null
					}
				},
				UserScreen: {
					screen: UserScreen,
					navigationOptions: {
						headerTitle: "Account",
						headerTitleStyle: styles.headerTitle,
						headerStyle: styles.altHeader,
						headerBackTitleStyle: styles.headerBack,
						headerTintColor: "white",
						headerBackTitle: null
					}
				}
			},
			{
				mode: "modal"
			}
		);
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
			screen: StreamsScreen,
			navigationOptions: {
				tabBarLabel: "Streams",
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
						style={[styles.tabIcon, { tintColor: tintColor }]}
						source={focused ? require("../../resources/login_active.png") : require("../../resources/login.png")}
					/>
				),
				tabBarOnPress: (tab, jumpToIndex) => {
					navigation.navigation.navigate("UserScreen");
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

		return TabNavigator(tabConfig, {
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
	auth: state.auth
}))(AppNavigation);
