import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { setActiveCommunity, switchAppView } from "../../redux/actions/app";
import { CommunityBox } from "../../ecosystems/MultiCommunity";
import Button from "../../atoms/Button";
import HeaderButton from "../../atoms/HeaderButton";
import NavigationService from "../../utils/NavigationService";
import styles from "../../styles";
import icons from "../../icons";

const store = configureStore();

class MyCommunitiesScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "My Communities",
			headerRight: <HeaderButton icon={icons.PLUS_CIRCLE} onPress={navigation.getParam("onPressAddCommunity")} />
		};
	};

	constructor(props) {
		super(props);
		this._pressHandlers = {};
		this.pressCommunity = this.pressCommunity.bind(this);

		this.props.navigation.setParams({
			onPressAddCommunity: this.onPressAddCommunity.bind(this)
		});
	}

	getListData() {
		const data = [
			{
				id: "1",
				title: "Local",
				apiKey: Expo.Constants.manifest.extra.oauth_client_id,
				apiUrl: Expo.Constants.manifest.extra.api_url
			},
			{
				id: "2",
				title: "InvisionAlpha",
				apiKey: "d5f20f784ad0c7eb51e9b53f16ac370d",
				apiUrl: "https://auto.invisionalpha.com/"
			}
		];

		return data;
	}

	renderCommunity(item) {
		return (
			<CommunityBox
				onPress={this.pressCommunity({ apiUrl: Expo.Constants.manifest.extra.api_url, apiKey: Expo.Constants.manifest.extra.oauth_client_id })}
				title={item.title}
				apiKey={item.apiKey}
				apiUrl={item.apiUrl}
			/>
		);
	}
	onPressAddCommunity() {}

	pressCommunity(apiInfo) {
		if (_.isUndefined(this._pressHandlers[apiInfo.apiUrl])) {
			this._pressHandlers[apiInfo.apiUrl] = () => {
				store.dispatch(
					setActiveCommunity({
						apiUrl: apiInfo.apiUrl,
						apiKey: apiInfo.apiKey
					})
				);
			};
		}

		return this._pressHandlers[apiInfo.apiUrl];
	}

	render() {
		return (
			<View style={[styles.flex, styles.pStandard]}>
				<FlatList data={this.getListData()} keyExtractor={item => item.id} renderItem={({ item }) => this.renderCommunity(item)} style={styles.flex} />
			</View>
		);
	}
}

export default MyCommunitiesScreen;
