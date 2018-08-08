import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import NotificationSettingRow from "../../atoms/NotificationSettingRow";
import SectionHeader from "../../atoms/SectionHeader";

class NotificationsSettingsScreen extends Component {
	static navigationOptions = {
		title: "Notification Settings"
	};

	getNotificationSections() {
		return [
			{
				title: "General",
				data: [
					{
						key: "new_content",
						title: "New items in areas I follow",
						on: true,
						enabled: true
					},
					{
						key: "new_comment",
						title: "Comments on content I follow",
						on: true,
						enabled: true
					},
					{
						key: "new_review",
						title: "Reviews on content I follow",
						on: false,
						enabled: false
					},
					{
						key: "followed_user_post",
						title: "Posts by people I follow",
						on: false,
						enabled: true
					}
				]
			},
			{
				title: "Clubs",
				data: [
					{
						key: "club_invite",
						title: "Invites to join a club",
						on: true,
						enabled: false
					},
					{
						key: "club_request",
						title: "Responses to my club join requests",
						on: false,
						enabled: true
					}
				]
			}
		];
	}

	render() {
		return <SectionList 
			sections={this.getNotificationSections()}
			renderItem={({item}) => <NotificationSettingRow data={item} />}
			renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
		/>;
	}
}

export default NotificationsSettingsScreen;
