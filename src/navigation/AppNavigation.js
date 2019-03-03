import React, { Component } from "react";
import { createAppContainer, createBottomTabNavigator, createMaterialTopTabNavigator, createDrawerNavigator, createStackNavigator, NavigationActions } from "react-navigation";
import { BottomTabBar } from "react-navigation-tabs";
import { View } from "react-native";
import Image from "react-native-remote-svg";
import { connect } from "react-redux";
import { LinearGradient, WebBrowser } from "expo";

// ----
// IPS screens
import MultiHomeScreen from "../screens/ips/MultiHomeScreen";
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
import PollScreen from "../screens/core/PollScreen";
import LoginScreen from "../screens/core/LoginRegister/LoginScreen";
import RegisterScreen from "../screens/core/LoginRegister/RegisterScreen";
import WebViewScreen from "../screens/core/WebViewScreen";
import AccountSettingsScreen from "../screens/core/AccountSettings/AccountSettingsScreen";
import CommentViewSettingsScreen from "../screens/core/AccountSettings/CommentViewSettingsScreen";
// ----
// Forums screens
import ForumListScreen from "../screens/forums/ForumListScreen";
import FluidForumScreen from "../screens/forums/FluidForumScreen";
import ForumFollowedScreen from "../screens/forums/ForumFollowedScreen";
import TopicListScreen from "../screens/forums/TopicListScreen";
import TopicViewScreen from "../screens/forums/TopicViewScreen";
import CreateTopicScreen from "../screens/forums/CreateTopicScreen";
import ReplyTopicScreen from "../screens/forums/ReplyTopicScreen";

//import BrowserModal from "../ecosystems/BrowserModal";
import NavigationService from "../utils/NavigationService";
import { resetModalWebview } from "../redux/actions/app";
import { NavigationTabIcon, NavigationTabNotification } from "../ecosystems/Navigation";
import CustomHeader from "../ecosystems/CustomHeader";
import styles, { styleVars, tabStyles } from "../styles";
import Lang from '../utils/Lang';


class AppNavigation extends Component {
	constructor(props) {
		super(props);

		this._CommunityStack = this._getMainStack();
		this._StreamStack = this._getMainStack({}, 'StreamView');
		this._NotificationStack = this._getMainStack({}, 'NotificationsStack');
		this._SearchStack = this._getMainStack({}, 'SearchStack');
		this._LoginRegisterStack = this._getLoginRegisterStack();

		this.state = {
			MasterNavigation: this._getMasterNavigation()
		};
	}

	_getMainStack(options, initialRoute) {
		return createStackNavigator(
			{
				HomeScreen: { 
					screen: HomeScreen,
					navigationOptions: {
						title: this.props.site.settings.board_name
					}
				},
				ForumIndex: { screen: ForumListScreen },
				FluidForum: { 
					screen: FluidForumScreen,
					navigationOptions: {
						title: "All Topics"
					}
				},
				TopicList: { screen: TopicListScreen },
				TopicView: { screen: TopicViewScreen },
				Poll: { screen: PollScreen },
				Profile: { screen: ProfileScreen },
				SearchStack: { screen: SearchScreen },
				NotificationsStack: { screen: NotificationsScreen },
				NotificationsSettings: { screen: NotificationsSettingsScreen },
				AccountSettings: { 
					screen: this._getSettingsStack(),
					navigationOptions: {
						title: 'Account Settings'
					}
				},
				StreamView: { screen: StreamViewScreen },
				WebView: { screen: WebViewScreen }
			},
			{
				initialRouteName: initialRoute || 'HomeScreen',
				cardStyle: styles.stackCardStyle,
				defaultNavigationOptions: Object.assign({
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
				defaultNavigationOptions: Object.assign({
					title: 'Settings',
					header: null
				}, options || null)
			}
		);
	}

	_getLoginRegisterStack() {
		return createStackNavigator(
		{
			LoginScreen: { screen: LoginScreen },
			RegisterScreen: { screen: RegisterScreen },
			AuthWebView: { screen: WebViewScreen }
		},
		{
			initialRouteName: 'LoginScreen',
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
		});
	}

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
					screen: this._LoginRegisterStack,
					navigationOptions: {
						header: null,
						headerMode: 'none'
					}
				}
			},
			{
				mode: "modal",
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
		);


		return createAppContainer(
			createDrawerNavigator({
				Master: {
					screen: masterStack
				}
			}, {
				drawerPosition: 'left',
				contentComponent: UserScreen
			})
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
				tabBarIcon: (props) => (
					<NavigationTabIcon {...props} active={require("../../resources/home_active.png")} inactive={require("../../resources/home.png")} />
				)
			}
		};
		const Search = {
			screen: this._SearchStack,
			navigationOptions: {
				tabBarLabel: "Search",
				tabBarIcon: (props) => (
					<NavigationTabIcon {...props} active={require("../../resources/search_active.png")} inactive={require("../../resources/search.png")} />
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
				tabBarIcon: (props) => (
					<NavigationTabIcon {...props} active={require("../../resources/activity_active.png")} inactive={require("../../resources/activity.png")} />
				)
			}
		};
		const Notifications = {
			screen: this._NotificationStack,
			navigationOptions: navigation => ({
				tabBarLabel: "Notifications",
				tabBarIcon: (props) => (
					<NavigationTabNotification {...props} active={require("../../resources/notification_active.png")} inactive={require("../../resources/notification.png")} />
				)
			})
		};
		const User = {
			screen: UserScreen,
			navigationOptions: navigation => ({
				tabBarLabel: "You",
				tabBarIcon: ({ focused, tintColor }) => this._getUserPhoto(focused, tintColor),
				tabBarOnPress: (tab, jumpToIndex) => {
					navigation.navigation.openDrawer();
					//navigation.navigation.navigate("UserScreen");
				}
			})
		};
		const Login = {
			screen: this._LoginRegisterStack,
			navigationOptions: navigation => ({
				tabBarLabel: "Sign In/Up",
				tabBarIcon: (props) => (
					<NavigationTabIcon {...props} active={require("../../resources/login_active.png")} inactive={require("../../resources/login.png")} />
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

		if (this.props.auth.authenticated && !this.props.user.isGuest) {
			tabConfig = {
				Home,
				Search,
				Streams,
				Notifications,
				User
			};
		}

		const TabBarComponent = (props) => (<BottomTabBar {...props} />);

		return createBottomTabNavigator(tabConfig, {
			lazy: true,			
			tabBarPosition: "bottom",
			tabBarOptions: {
				showLabel: true,
				inactiveTintColor: styleVars.tabInactive,
				activeTintColor: styleVars.tabActive,
				style: styles.primaryTabBar
			}
		});
	}

	/**
	 * Return a URL for the user tab bar icon. Photo if it's a member, icon if it's a guest
	 *
	 * @return object|file resource
	 */
	_getUserPhoto(focused, tintColor) {		
		if( !this.props.user.isGuest && this.props.user.photo ){
			return (
				<View style={{ borderRadius: 24, overflow: 'hidden' }}>
					<Image
						style={[styles.tabIcon, styles.userTabIcon]}
						source={{ uri: unescape( this.props.user.photo ) }}
					/>
				</View>
			);
		} else {
			return (
				<NavigationTabIcon focused={focused} tintColor={tintColor} active={require("../../resources/login_active.png")} inactive={require("../../resources/login.png")} />
			);
		}
	}

	/**
	 * Called after component updates with new props
	 *
	 * Update master navigation component depending on guest status
	 * We use this to show appropriate tabs to guests vs. members
	 */
	async componentDidUpdate(prevProps) {
		if (this.props.user.isGuest !== prevProps.user.isGuest) {
			this.setState({
				MasterNavigation: this._getMasterNavigation()
			});
		}
	}

	/**
	 * Render component
	 */
	render() {
		return (
			<React.Fragment>
				<this.state.MasterNavigation ref={navigatorRef => { NavigationService.setTopLevelNavigator(navigatorRef) }} />
			</React.Fragment>
		);
	}
}

export default connect(state => ({
	app: state.app,
	user: state.user,
	auth: state.auth,
	site: state.site
}))(AppNavigation);
