import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { loadCommunityCategory } from "../../redux/actions/app";
import { CategoryBox } from "../../ecosystems/MultiCommunity";
import Button from "../../atoms/Button";
import NavigationService from "../../utils/NavigationService";
import styles from "../../styles";

class MultiCategoryScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.categoryName ? navigation.state.params.categoryName : "Loading..."
	});

	constructor(props) {
		super(props);
		this._pressHandlers = {};
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

	render() {
		const { categoryID } = this.props.navigation.state.params;
		const thisCategory = this.props.app.categories[categoryID];

		if (thisCategory.loading) {
			return <Text>Loading</Text>;
		} else if (thisCategory.error) {
			return <Text>Couldn't load this category</Text>;
		} else {
			return thisCategory.items.map(item => <Text>{item.name}</Text>);
		}
	}
}

export default connect(state => ({
	app: state.app
}))(MultiCategoryScreen);
