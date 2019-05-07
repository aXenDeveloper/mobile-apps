import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import SectionHeader from "../../../atoms/SectionHeader";
import SettingRow from "../../../atoms/SettingRow";
import { ContentView } from "../../../ecosystems/AppSettings";

class AccountSettingsScreen extends Component {
	static navigationOptions = {
		title: "Account Settings"
	};

	getAccountSections() {
		return [
			/*{
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
			},*/
			{
				title: "Content View Behavior",
				first: true,
				data: [
					{
						key: "content_order"
					}
				]
			}
		];
	}

	renderItem({ item, index, section }) {
		if (item.key == "content_order") {
			return <ContentView />;
		}

		return <SettingRow data={item} />;
	}

	renderSectionHeader({ section }) {
		return (
			<View style={!section.first ? styles.mtExtraWide : null}>
				<SectionHeader title={section.title} />
			</View>
		);
	}

	render() {
		return (
			<SectionList
				sections={this.getAccountSections()}
				renderItem={this.renderItem}
				renderSectionHeader={this.renderSectionHeader}
				SectionSeparatorComponent={this.renderSectionSeparator}
				stickySectionHeadersEnabled={false}
			/>
		);
	}
}

export default AccountSettingsScreen;
