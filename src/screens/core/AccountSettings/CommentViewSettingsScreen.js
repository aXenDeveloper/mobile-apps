import React, { Component } from "react";
import { Text, View, FlatList, ScrollView } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import CheckList from "../../../ecosystems/CheckList";

class CommentViewSettingsScreen extends Component {
	static navigationOptions = {
		title: "Comment Views"
	};

	getViewOptions() {
		return [
			{
				key: 'unread',
				title: 'Start at unread comments',
				checked: true
			},
			{
				key: 'first',
				title: 'Start at the first comment',
				checked: false
			}
		];
	}

	onValueChange(selected) {
		console.log(selected);
	}

	render() {
		return <CheckList type='radio' data={this.getViewOptions()} onValueChange={this.onValueChange.bind(this)} />
	}
}

export default CommentViewSettingsScreen;
