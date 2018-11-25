import React, { Component } from "react";
import {
	Text,
	View,
	Button,
	ScrollView,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Alert,
	StatusBar,
	Image
} from "react-native";
import { SafeAreaView } from "react-navigation";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import { connect } from "react-redux";

import { logOut } from "../../redux/actions/auth";
import MenuItem from "../../atoms/MenuItem";
import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
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

class UserScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: "Account"
	});

	constructor(props) {
		super(props);
	}

	_logOut() {
		const { dispatch } = this.props;

		Alert.alert(
			"Confirm",
			"Are you sure you want to log out on this device?",
			[
				{ text: "Cancel", onPress: () => console.log("Canceled") },
				{
					text: "Log Out",
					onPress: () => dispatch(logOut(this.props.client)),
					style: "destructive"
				}
			]
		);
	}

	goToProfile() {
		this.props.navigation.navigate({
			routeName: "Profile",
			params: {
				id: this.props.data.core.me.id
			},
			key: this.props.data.core.me.id
		});
	}

	getMenuOptions() {
		return [
			{
				key: "edit_profile",
				icon: icons.USER_DOCUMENT,
				text: Lang.get("edit_profile"),
				onPress: () => {
					console.log("edit_profile");
				}
			},
			{
				key: "settings",
				icon: icons.COG,
				text: Lang.get("settings"),
				onPress: () => {
					this.props.navigation.closeDrawer();
					this.props.navigation.navigate("AccountSettingsScreen");
				}
			},
			{
				key: "notifications",
				icon: icons.BELL,
				text: Lang.get("notification_settings"),
				onPress: () => {
					this.props.navigation.closeDrawer();
					this.props.navigation.navigate("NotificationsSettings");
				}
			},
			{
				key: "signout",
				icon: icons.SIGN_OUT,
				text: Lang.get("sign_out"),
				onPress: () => {
					this._logOut();
				}
			}
		];
	}

	render() {
		if (this.props.data.loading) {
			return (
				<View repeat={7}>
					<Text>Loading</Text>
				</View>
			);
		} else if ( this.props.data.error ) {
			console.log( this.props.data.error );
		} else {
			return (
				<View style={componentStyles.container}>
					<StatusBar barStyle="light-content" translucent />
					<SafeAreaView style={componentStyles.innerContainer}>
						<View style={componentStyles.profileHeader}>
							{this.props.data.core.me.coverPhoto.image ? (
								<Image
									source={{
										uri: this.props.data.core.me.coverPhoto
											.image
									}}
									style={componentStyles.coverPhoto}
									resizeMode="cover"
								/>
							) : null}
						</View>
						<View style={componentStyles.mainArea}>
							<UserPhoto
								url={this.props.data.core.me.photo}
								size={60}
							/>
							<TouchableOpacity onPress={() => this.goToProfile()}>
								<Text style={componentStyles.username}>
									{this.props.data.core.me.name}
								</Text>
								<Text style={componentStyles.meta}>
									{Lang.get('your_profile')}
								</Text>
							</TouchableOpacity>

							<FlatList
								style={componentStyles.profileMenu}
								data={this.getMenuOptions()}
								renderItem={({ item }) => (
									<MenuItem data={item} />
								)}
							/>
						</View>
						<View style={componentStyles.footer}>
							<Image
								source={require("../../../resources/info_filled.png")}
								resizeMode="contain"
								style={componentStyles.infoIcon}
							/>
							<Text style={[styles.veryLightText, componentStyles.footerText]}>
								{Lang.get('legal_notices')}
							</Text>
						</View>
					</SafeAreaView>
				</View>
			);
		}
	}
}

// <Button onPress={() => this._logOut()} style={componentStyles.button} title="Sign Out" />

export default graphql(UserQuery)(
	connect(state => {
		return state;
	})(withApollo(UserScreen))
);

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
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
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
