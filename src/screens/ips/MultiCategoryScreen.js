import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { setActiveCommunity, switchAppView } from "../../redux/actions/app";
import { CommunityBox } from "../../ecosystems/MultiCommunity";
import Button from "../../atoms/Button";
import NavigationService from "../../utils/NavigationService";
import styles from "../../styles";

const store = configureStore();

class MultiCategoryScreen extends Component {
	static navigationOptions = {
		title: "MultiCategoryScreen"
	};

	constructor(props) {
		super(props);
		this._pressHandlers = {};
		this.pressCommunity = this.pressCommunity.bind(this);
	}

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
			<View style={styles.pStandard}>
				<Text>Multi category</Text>
				<CommunityBox
					onPress={this.pressCommunity({ apiUrl: Expo.Constants.manifest.extra.api_url, apiKey: Expo.Constants.manifest.extra.oauth_client_id })}
					title="Local"
					apiKey={Expo.Constants.manifest.extra.oauth_client_id}
					apiUrl={Expo.Constants.manifest.extra.api_url}
				/>
				<CommunityBox
					onPress={this.pressCommunity({ apiUrl: "https://auto.invisionalpha.com/", apiKey: "d5f20f784ad0c7eb51e9b53f16ac370d" })}
					title="InvisionAlpha"
					apiKey="d5f20f784ad0c7eb51e9b53f16ac370d"
					apiUrl="https://auto.invisionalpha.com/"
				/>
			</View>
		);
	}
}

export default MultiCategoryScreen;
