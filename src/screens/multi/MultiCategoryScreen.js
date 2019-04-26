import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";

import { loadCommunityCategory, setActiveCommunity, toggleSavedCommunity } from "../../redux/actions/app";
import { CommunityBox } from "../../ecosystems/MultiCommunity";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import Button from "../../atoms/Button";
import ErrorBox from "../../atoms/ErrorBox";
import NavigationService from "../../utils/NavigationService";
import icons from "../../icons";
import styles from "../../styles";

class MultiCategoryScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.categoryName ? navigation.state.params.categoryName : "Loading..."
	});

	constructor(props) {
		super(props);
		this._pressHandlers = {};
		this._togglePressHandlers = {};
	}

	componentDidMount() {
		const { categoryID } = this.props.navigation.state.params;

		this.props.dispatch(loadCommunityCategory(categoryID));
		this.setScreenTitle(this.props.app.categories[categoryID].name);
	}

	componentDidUpdate(prevProps) {
		const { categoryID } = this.props.navigation.state.params;

		if (prevProps.navigation.state.params.categoryID !== categoryID) {
			this.props.dispatch(loadCommunityCategory(categoryID));
			this.setScreenTitle(this.props.app.categories[categoryID].name);
		}
	}

	setScreenTitle(name) {
		this.props.navigation.setParams({
			categoryName: name
		});
	}

	/**
	 * Memoization function that returns an onPress handler for a community
	 *
	 * @param 	object 		Object with apiUrl and apiKey values
	 * @return 	function
	 */
	pressCommunity(apiInfo) {
		if (_.isUndefined(this._pressHandlers[apiInfo.apiUrl])) {
			this._pressHandlers[apiInfo.apiUrl] = () => {
				this.props.dispatch(
					setActiveCommunity({
						apiUrl: apiInfo.apiUrl,
						apiKey: apiInfo.apiKey
					})
				);
			};
		}

		return this._pressHandlers[apiInfo.apiUrl];
	}

	getToggleCommunityHandler(id) {
		if (_.isUndefined(this._togglePressHandlers[id])) {
			this._togglePressHandlers[id] = () => {
				const categoryItems = this.props.app.categories[this.props.navigation.state.params.categoryID];
				const community = _.find(categoryItems.items, item => item.id === id);

				this.props.dispatch(toggleSavedCommunity(community));
				delete this._togglePressHandlers[id];
			};
		}

		return this._togglePressHandlers[id];
	}

	renderItem(item) {
		const { id, name, client_id: apiKey, logo, description, url: apiUrl } = item;
		const isSaved = _.find(this.props.app.communities.data, community => community.id === id);

		return (
			<CommunityBox
				onPress={this.pressCommunity({ apiUrl: item.url, apiKey: item.client_id })}
				name={name}
				logo={logo}
				description={description}
				apiKey={apiKey}
				apiUrl={apiUrl}
				communityLoading={!this.props.app.bootStatus.loaded && this.props.app.currentCommunity.apiUrl == apiUrl}
				rightComponent={
					<View style={{ width: 35 }}>
						{isSaved ? (
							<Button
								onPress={this.getToggleCommunityHandler(id)}
								icon={icons.CHECKMARK2}
								type="light"
								small
								rounded
								filled
								style={{ width: 36, height: 36 }}
							/>
						) : (
							<Button onPress={this.getToggleCommunityHandler(id)} icon={icons.PLUS} type="primary" small rounded style={{ width: 36, height: 36 }} />
						)}
					</View>
				}
			/>
		);
	}

	render() {
		const { categoryID } = this.props.navigation.state.params;
		const thisCategory = this.props.app.categories[categoryID];

		if (thisCategory.loading) {
			return (
				<View>
					<PlaceholderRepeater repeat={7}>
						<CommunityBox loading />
					</PlaceholderRepeater>
				</View>
			);
		} else if (thisCategory.error) {
			return <ErrorBox message="Sorry, there was a problem fetching the communities in this category. Please try again later." />;
		} else {
			return (
				<FlatList
					extraData={this.props.app.communities.data}
					data={thisCategory.items}
					keyExtractor={item => item.id}
					renderItem={({ item }) => this.renderItem(item)}
				/>
			);
		}
	}
}

export default connect(state => ({
	app: state.app
}))(MultiCategoryScreen);
