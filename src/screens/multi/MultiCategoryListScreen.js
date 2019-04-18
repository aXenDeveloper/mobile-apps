import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { loadCommunityCategories } from "../../redux/actions/app";
import { CategoryBox } from "../../ecosystems/MultiCommunity";
import Button from "../../atoms/Button";
import LargeTitle from "../../atoms/LargeTitle";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import NavigationService from "../../utils/NavigationService";
import styles from "../../styles";

class MultiCategoryListScreen extends Component {
	static navigationOptions = {
		title: "Discover"
	};

	constructor(props) {
		super(props);
		this._pressHandlers = {};
	}

	/**
	 * Mount point. Dispatch action to fetch categories if we don't have them already
	 *
	 * @return 	void
	 */
	componentDidMount() {
		if (!this.props.app.categoryList.loaded && !this.props.app.categoryList.error) {
			this.props.dispatch(loadCommunityCategories());
		}
	}

	/**
	 * Memoization function that returns an onPress handler for a category
	 *
	 * @param 	string 		Category ID to load on press
	 * @return 	function
	 */
	getOnPressHandler(categoryID) {
		if (_.isUndefined(this._pressHandlers[categoryID])) {
			this._pressHandlers[categoryID] = () => {
				this.props.navigation.navigate("Category", {
					categoryID,
					categoryName: this.props.app.categories[categoryID].name
				});
			};
		}

		return this._pressHandlers[categoryID];
	}

	/**
	 * Turns an array of category IDs into an array of pairs, e.g. [ [one, two], [three, four] ]
	 * We do this so we can show the categories in rows of two easily
	 *
	 * @param 	object 		Object with apiUrl and apiKey values
	 * @return 	array
	 */
	getDataInPairs() {
		return Object.keys(this.props.app.categories).reduce((result, value, index, array) => {
			if (index % 2 === 0) {
				result.push(array.slice(index, index + 2));
			}
			return result;
		}, []);
	}

	/**
	 * Build the list of categories
	 *
	 * @return 	Component
	 */
	getCategoryList() {
		if (this.props.app.categoryList.loading) {
			return (
				<PlaceholderRepeater repeat={3}>
					<View style={[styles.flexRow, styles.mbWide]}>
						<CategoryBox loading style={styles.mrTight} />
						<CategoryBox loading style={styles.mlTight} />
					</View>
				</PlaceholderRepeater>
			);
		} else if (this.props.app.categoryList.error) {
			return <Text>Couldn't load categories</Text>;
		} else {
			const categories = this.props.app.categories;
			const pairs = this.getDataInPairs();

			return pairs.map((pair, pairIdx) => (
				<View style={[styles.flexRow, styles.mbWide]} key={pairIdx}>
					{pair.map((category, idx) => (
						<CategoryBox
							name={categories[category].name}
							onPress={this.getOnPressHandler(category)}
							id={category}
							key={category}
							style={idx == 0 ? styles.mrTight : styles.mlTight}
						/>
					))}
				</View>
			));
		}
	}

	render() {
		// Generating the category list is done in getCategoryList because the expectation is we'll
		// eventually have other blocks on this screen that load independently
		return (
			<ScrollView>
				<LargeTitle>Categories</LargeTitle>
				<View style={styles.phWide}>{this.getCategoryList()}</View>
			</ScrollView>
		);
	}
}

export default connect(state => ({
	app: state.app
}))(MultiCategoryListScreen);
