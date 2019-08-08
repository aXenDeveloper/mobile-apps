import React, { Component } from "react";
import { Text, View, Button, ScrollView, FlatList, StyleSheet, TouchableOpacity, Alert, StatusBar, Image } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { SafeAreaView } from "react-navigation";
import gql from "graphql-tag";
import ActionSheet from "react-native-actionsheet";
import { graphql, withApollo, compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";
import isURL from "validator/lib/isURL";

import { logOut } from "../../redux/actions/auth";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import MenuItem from "../../atoms/MenuItem";
import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
import getImageUrl from "../../utils/getImageUrl";
import NavigationService from "../../utils/NavigationService";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

const UserQuery = gql`
	query UserQuery {
		core {
			me {
				id
				name
				email
				photo
				coverPhoto {
					image
					offset
				}
			}
		}
	}
`;

const SessionEndMutation = gql`
	mutation SessionEnd($token: String) {
		mutateCore {
			sessionEnd(token: $token) {
				id
			}
		}
	}
`;

class UserScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: Lang.get("tab_user")
	});

	constructor(props) {
		super(props);

		this._mounted = false;
		this._actionSheetOptions = [];

		this.state = {
			loading: true
		};

		this.confirmLogOut = this.confirmLogOut.bind(this);
		this.doLogOut = this.doLogOut.bind(this);
		this.onPressLegal = this.onPressLegal.bind(this);
		this.actionSheetPress = this.actionSheetPress.bind(this);
	}

	componentDidMount() {
		this._mounted = true;
		this.updateDrawer();
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentDidUpdate(prevProps) {
		if (this.props.auth.isAuthenticated !== prevProps.auth.isAuthenticated) {
			this.updateDrawer();
		}
	}

	/**
	 * Handle tapping the 'Legal Notices' link
	 *
	 * @return 	void
	 */
	onPressLegal() {
		this._actionSheet.show();
	}

	/**
	 * Return the options to show in the legal notices actionsheet
	 *
	 * @return 	array
	 */
	getActionSheetOptions() {
		const { settings } = this.props.site;
		const options = [{ type: "cancel", title: Lang.get("cancel") }];

		if (settings.privacy_type !== "NONE") {
			if (settings.privacy_type === "INTERNAL" || (settings.privacy_type === "EXTERNAL" && isURL(settings.privacy_link))) {
				options.push({
					type: "privacy",
					title: Lang.get("legal_privacy")
				});
			}
		}

		if (settings.guidelines_type !== "NONE") {
			if (settings.guidelines_type === "INTERNAL" || (settings.guidelines_type === "EXTERNAL" && isURL(settings.guidelines_link))) {
				options.push({
					type: "guidelines",
					title: Lang.get("legal_guidelines")
				});
			}
		}

		options.push({
			type: "terms",
			title: Lang.get("legal_terms")
		});

		options.push({
			type: "licenses",
			title: Lang.get("third_party_licenses")
		});

		this._actionSheetOptions = options;

		// @todo language
		return _.pluck(options, "title");
	}

	/**
	 * Handle tapping an action sheet item. Triggers the relevant action.
	 *
	 * @param 	number 	i 	THe index of the item that was tapped
	 * @return 	void
	 */
	actionSheetPress(i) {
		const { settings } = this.props.site;
		const itemPressed = this._actionSheetOptions[i];
		const { type } = itemPressed;

		if (type === "cancel") {
			return;
		} else if (type === "licenses") {
			NavigationService.navigateToScreen("Licenses");
		} else if (type === "terms") {
			NavigationService.navigateToScreen("LegalDocument", {
				type,
				content: settings.reg_rules.original
			});
		} else {
			if (settings[`${type}_type`] === "INTERNAL") {
				NavigationService.navigateToScreen("LegalDocument", {
					type,
					content: settings[`${type}_text`].original
				});
			} else {
				NavigationService.navigate(settings[`${type}_link`], {}, { forceBrowser: true });
			}
		}
	}

	/**
	 * Query the site for the user's info which we'll store in state
	 *
	 * @return 	void
	 */
	async updateDrawer() {
		this.setState({
			loading: true
		});

		try {
			const { data } = await this.props.auth.client.query({
				query: UserQuery
			});

			if (!this._mounted) {
				return;
			}

			this.setState({
				loading: false,
				userData: data.core.me
			});
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Promps the user to confirm their logout
	 *
	 * @return 	void
	 */
	confirmLogOut() {
		Alert.alert(Lang.get("confirm"), Lang.get("confirm_logout"), [
			{ text: Lang.get("cancel"), onPress: () => console.log("USERSCREEN: Canceled logout") },
			{
				text: Lang.get("sign_out"),
				onPress: this.doLogOut,
				style: "destructive"
			}
		]);
	}

	/**
	 * Actually does the logout. Sends a session end request, and then triggers an action
	 * to log the user out.
	 *
	 * @return 	void
	 */
	async doLogOut() {
		// Get the user's push token so we can de-register with the community
		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		let token = null;

		// If they haven't granted access then we don't need to do anything here
		if (status === "granted") {
			// Get the token that uniquely identifies this device
			try {
				token = await Notifications.getExpoPushTokenAsync();
			} catch (err) {
				console.log("USERSCREEN: No token to deregister");
			}
		}

		// Call the session end mutation, and pass token if we have one
		console.log(`USERSCREEN: Ending session, sending token ${token}...`);

		const { data } = await this.props.auth.client.mutate({
			mutation: SessionEndMutation,
			variables: {
				token
			}
		});

		console.log("USERSCREEN: Session ended.");

		this.props.dispatch(logOut());
	}

	/**
	 * Takes the user to their profile
	 *
	 * @return 	void
	 */
	goToProfile() {
		this.props.navigation.navigate({
			routeName: "Profile",
			params: {
				id: this.state.userData.id
			},
			key: this.state.userData.id
		});
	}

	/**
	 * Return the menu options for the user
	 *
	 * @return 	array
	 */
	getMenuOptions() {
		let options = [];

		/*{
			key: "edit_profile",
			icon: icons.USER_DOCUMENT,
			text: Lang.get("edit_profile"),
			onPress: () => {
				console.log("edit_profile");
			}
		},*/

		// For now, only show account settings if we're in white-label - unread settings
		// will be in the main view for the multi app
		if (!Expo.Constants.manifest.extra.multi) {
			options.push({
				key: "settings",
				icon: icons.COG,
				text: Lang.get("settings"),
				onPress: () => {
					this.props.navigation.closeDrawer();
					this.props.navigation.navigate("AccountSettingsScreen");
				}
			});
		}

		options.push({
			key: "notifications",
			icon: icons.BELL,
			text: Lang.get("notification_settings"),
			onPress: () => {
				this.props.navigation.closeDrawer();
				this.props.navigation.navigate("NotificationsSettings");
			}
		});

		options.push({
			key: "signout",
			icon: icons.SIGN_OUT,
			text: Lang.get("sign_out"),
			onPress: () => {
				this.confirmLogOut();
			}
		});

		return options;
	}

	/**
	 * Build the draw components
	 *
	 * @return 	Component
	 */
	buildDrawContents() {
		if (!this.props.auth.isAuthenticated) {
			return null;
		}

		return (
			<View style={componentStyles.container}>
				<StatusBar barStyle="light-content" translucent />
				<SafeAreaView style={componentStyles.innerContainer}>
					<View style={componentStyles.profileHeader}>
						{this.state.userData.coverPhoto.image ? (
							<Image
								source={{
									uri: getImageUrl(this.state.userData.coverPhoto.image)
								}}
								style={componentStyles.coverPhoto}
								resizeMode="cover"
							/>
						) : null}
					</View>
					<View style={componentStyles.mainArea}>
						<UserPhoto url={this.state.userData.photo} size={60} />
						<TouchableOpacity onPress={() => this.goToProfile()}>
							<Text style={componentStyles.username}>{this.state.userData.name}</Text>
							<Text style={componentStyles.meta}>{Lang.get("your_profile")}</Text>
						</TouchableOpacity>

						<FlatList style={componentStyles.profileMenu} data={this.getMenuOptions()} renderItem={({ item }) => <MenuItem data={item} />} />
					</View>
					<View style={componentStyles.footer}>
						<Image source={icons.INFO_SOLID} resizeMode="contain" style={componentStyles.infoIcon} />
						<TouchableOpacity onPress={this.onPressLegal}>
							<Text style={[styles.veryLightText, componentStyles.footerText]}>{Lang.get("legal_notices")}</Text>
						</TouchableOpacity>
					</View>
					<ActionSheet ref={o => (this._actionSheet = o)} cancelButtonIndex={0} options={this.getActionSheetOptions()} onPress={this.actionSheetPress} />
				</SafeAreaView>
			</View>
		);
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.flex}>
					<PlaceholderContainer>
						<PlaceholderElement top={0} left={0} right={0} height={90} style={{ width: "100%" }} />
						<PlaceholderElement circle radius={60} top={70} left={20} />
						<PlaceholderElement top={140} left={20} width={80} height={17} />
						<PlaceholderElement top={163} left={20} width={150} />

						<PlaceholderElement circle radius={20} top={240} left={20} />
						<PlaceholderElement top={243} left={45} width={150} height={12} />
						<PlaceholderElement circle radius={20} top={270} left={20} />
						<PlaceholderElement top={273} left={45} width={150} height={12} />
						<PlaceholderElement circle radius={20} top={300} left={20} />
						<PlaceholderElement top={303} left={45} width={150} height={12} />
						<PlaceholderElement circle radius={20} top={330} left={20} />
						<PlaceholderElement top={333} left={45} width={150} height={12} />
					</PlaceholderContainer>
				</View>
			);
		} else if (this.state.error) {
			return (
				<View>
					<Text>Error</Text>
				</View>
			);
		} else {
			return this.buildDrawContents();
		}
	}
}

export default compose(
	connect(state => ({
		auth: state.auth,
		site: state.site
	}))
)(UserScreen);

const componentStyles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		display: "flex",
		flex: 1
	},
	innerContainer: {
		display: "flex",
		flex: 1,
		alignItems: "stretch"
	},
	profileHeader: {
		height: 90,
		marginTop: -20
	},
	coverPhoto: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: 90,
		backgroundColor: "#f0f0f0"
	},
	mainArea: {
		display: "flex",
		alignItems: "flex-start",
		flex: 1,
		paddingHorizontal: styleVars.spacing.veryWide,
		marginTop: -20
	},
	username: {
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 10
	},
	meta: {
		fontSize: 15,
		color: styleVars.lightText
	},
	profileMenu: {
		marginTop: 20
	},
	footer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: styleVars.spacing.veryWide,
		paddingVertical: styleVars.spacing.wide
	},
	footerText: {
		marginLeft: styleVars.spacing.veryTight
	},
	infoIcon: {
		width: 17,
		height: 17,
		opacity: 0.7,
		tintColor: styleVars.veryLightText
	}
});
