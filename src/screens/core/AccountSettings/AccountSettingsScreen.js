import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import SectionHeader from "../../../atoms/SectionHeader";
import SettingRow from "../../../atoms/SettingRow";
import { ContentView } from "../../../ecosystems/AppSettings";
import { withTheme } from "../../../themes";

class AccountSettingsScreen extends Component {
	static navigationOptions = {
		title: "Account Settings"
	};

	constructor(props) {
		super(props);
		this.renderItem = this.renderItem.bind(this);
		this.renderSectionHeader = this.renderSectionHeader.bind(this);
	}

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
		const { styles } = this.props;
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
				stickySectionHeadersEnabled={false}
			/>
		);
	}
}

export default withTheme()(AccountSettingsScreen);
