import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { setActiveCommunity, switchAppView, setCommunities, loadCommunities, _devStoreCommunities } from "../../redux/actions/app";
import { CommunityBox } from "../../ecosystems/MultiCommunity";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
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

		this.state = {
			loading: true
		};

		this._pressHandlers = {};
		this.pressCommunity = this.pressCommunity.bind(this);

		this.props.navigation.setParams({
			onPressAddCommunity: this.onPressAddCommunity.bind(this)
		});
	}

	/**
	 * Mount point. Dispatch action to load our saved community list
	 *
	 * @return void
	 */
	componentDidMount() {
		this.props.dispatch(loadCommunities());
	}

	/**
	 * Modifies data coming in from redux to filter only communities we can currently
	 * load in the app.
	 *
	 * @return array
	 */
	getListData() {
		const communities = this.props.app.communities.data;
		const activeCommunities = _.filter(communities, community => community.status === "ok");

		return activeCommunities;
	}

	/**
	 * Render a community in the flatlist
	 *
	 * @param  	object 		item 		Object containing item data to render
	 * @return 	Component
	 */
	renderCommunity(item) {
		const { url: apiUrl, client_id: apiKey, name } = item;
		return <CommunityBox onPress={this.pressCommunity({ apiUrl, apiKey })} name={name} apiKey={apiKey} apiUrl={apiUrl} />;
	}

	/**
	 * Handler for tapping the + button to add a new community to the app
	 *
	 * @return void
	 */
	onPressAddCommunity() {}

	/**
	 * Memoization function that returns an onPress handler for a community
	 *
	 * @param 	object 		Object with apiUrl and apiKey values
	 * @return 	function
	 */
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
		if (this.props.app.communities.loading) {
			return (
				<React.Fragment>
					<PlaceholderRepeater repeat={4}>
						<CommunityBox loading />
					</PlaceholderRepeater>
				</React.Fragment>
			);
		} else if (this.props.app.communities.error) {
			return <Text>Sorry, we can't load your saved communities right now. Please try again later.</Text>;
		} else {
			// @todo empty list
			return (
				<View style={[styles.flex]}>
					<FlatList
						data={this.getListData()}
						keyExtractor={item => item.id}
						renderItem={({ item }) => this.renderCommunity(item)}
						style={styles.flex}
						contentContainerStyle={styles.pStandard}
					/>
				</View>
			);
		}
	}
}

export default connect(state => ({
	app: state.app
}))(MyCommunitiesScreen);
