import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, SectionList, Platform, Image } from "react-native";
import * as Permissions from "expo-permissions";
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import NotificationSettingRow from "../../atoms/NotificationSettingRow";
import SectionHeader from "../../atoms/SectionHeader";
import ErrorBox from "../../atoms/ErrorBox";
import styles from "../../styles";
import icons from "../../icons";

/* Main query, passed as a HOC */
const NotificationQuery = gql`
	query NotificationTypeQuery {
		core {
			notificationTypes {
				id
				name
				group
				lang
				inline {
					disabled
					default
					value
				}
			}
		}
	}
`;

class NotificationsSettingsScreen extends Component {
	static navigationOptions = {
		title: "Notification Settings"
	};

	constructor(props) {
		super(props);

		this.state = {
			hasPermission: true // We'll assume true to start with, rather than flashing the error
		};
	}

	componentDidMount() {
		this.checkNotificationPermissions();
	}

	async checkNotificationPermissions() {
		const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

		console.log(status);

		if (status !== "granted") {
			this.setState({
				hasPermission: false
			});
		}
	}

	getNotificationSections() {
		const sections = {};
		const types = this.props.data.core.notificationTypes;

		types.forEach(type => {
			if (_.isUndefined(sections[type.group])) {
				sections[type.group] = {
					title: type.group,
					data: []
				};
			}

			const langKey = `notifications__${type.id}`;

			sections[type.group].data.push({
				key: type.id,
				title: Lang.get(langKey) !== langKey ? Lang.get(langKey) : type.lang,
				on: type.inline.value,
				enabled: !type.inline.disabled
			});
		});

		return Object.values(sections);
	}

	getListFooter() {
		if (Platform.OS !== "android") {
			return;
		}

		return (
			<View style={styles.pWide}>
				<Text style={[styles.lightText, styles.standardText]}>Notifications you receive are also configurable in your Android system settings.</Text>
				<Text style={[styles.lightText, styles.standardText]}>
					You'll only receive notifications if you have granted permission both in Android settings and on this screen.
				</Text>
			</View>
		);
	}

	getListHeader() {
		if (this.state.hasPermission) {
			return null;
		}

		let platformInstructions;

		if (Platform.OS === "ios") {
			platformInstructions = "To check permissions, go to the Settings app from your home screen, then tap Notifications.";
		} else {
			platformInstructions = "To check permissions, go to the Settings app on your Android device, then tap Apps & Notifications.";
		}

		return (
			<View style={[styles.pWide, styles.mtStandard, styles.flexRow, styles.flexAlignStart]}>
				<Image source={icons.INFO} resizeMode="contain" style={[{ width: 20, height: 20 }, styles.mrStandard, styles.lightImage]} />
				<Text style={[styles.standardText, styles.text, styles.flexBasisZero, styles.flexGrow]}>
					You have not yet granted notification permissions on this device. {platformInstructions}
				</Text>
			</View>
		);
	}

	render() {
		if (this.props.data.loading) {
			return (
				<PlaceholderRepeater repeat={7}>
					<NotificationSettingRow loading />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			return <ErrorBox message={Lang.get("notifications_error")} />;
		} else {
			const ListEmptyComponent = <ErrorBox message={Lang.get("notifications_error")} />;

			return (
				<View style={{ flex: 1 }}>
					<SectionList
						sections={this.getNotificationSections()}
						renderItem={({ item }) => <NotificationSettingRow data={item} />}
						renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
						ListFooterComponent={this.getListFooter()}
						ListHeaderComponent={this.getListHeader()}
					/>
				</View>
			);
		}
	}
}

export default compose(
	connect(state => ({
		user: state.user
	})),
	withApollo,
	graphql(NotificationQuery)
)(NotificationsSettingsScreen);
