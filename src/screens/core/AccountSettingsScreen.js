import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import SectionHeader from "../../atoms/SectionHeader";
import SettingRow from "../../atoms/SettingRow";

class AccountSettingsScreen extends Component {
	static navigationOptions = {
		title: "Account Settings"
	};

	getAccountSections() {
		return [
			{
				title: "General",
				data: [
					{
						key: "display_name",
						title: "Display Name",
						value: 'Rikki'
					},
					{
						key: "email_address",
						title: "Email Address",
						value: 'rtissier@invisionpower.com'
					},
					{
						key: "password",
						title: "Password",
						value: '******'
					}
				]
			},
		];
	}

	render() {
		return <SectionList 
			sections={this.getAccountSections()}
			renderItem={({item}) => <SettingRow data={item} />}
			renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
		/>;
	}
}

export default AccountSettingsScreen;
