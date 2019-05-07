import React, { Component } from "react";
import { Text, View, StyleSheet, SectionList } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";
import { LinearGradient } from "expo";
import { Header } from "react-navigation";
import FadeIn from "react-native-fade-in-image";

import { loadCommunityCategory, setActiveCommunity, toggleSavedCommunity } from "../../redux/actions/app";
import SectionHeader from "../../atoms/SectionHeader";
import SettingRow from "../../atoms/SettingRow";
import { ContentView } from "../../ecosystems/AppSettings";
import icons, { illustrations } from "../../icons";
import styles, { styleVars } from "../../styles";

class MultiSettingsScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: "Preferences"
	});

	constructor(props) {
		super(props);
	}

	/**
	 * Load items in this category as soon as we mount
	 *
	 * @return 	void
	 */
	componentDidMount() {}

	/**
	 * Return the settings list items
	 *
	 * @return array
	 */
	getAccountSections() {
		return [
			{
				title: "Content View Behavior",
				first: true,
				data: [
					{
						key: "content_order"
					}
				]
			},
			{
				title: "Enabled Notifications",
				first: false,
				data: []
			}
		];
	}

	/**
	 * Render a setting list item. Uses generic row unless otherwise directed
	 *
	 * @return Component
	 */
	renderItem({ item, index, section }) {
		if (item.key == "content_order") {
			return <ContentView />;
		}

		return <SettingRow data={item} />;
	}

	/**
	 * Render a section header, applying extra top padding if we're not the first section
	 *
	 * @return array
	 */
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

export default connect(state => ({
	app: state.app
}))(MultiSettingsScreen);

const componentStyles = StyleSheet.create({});
