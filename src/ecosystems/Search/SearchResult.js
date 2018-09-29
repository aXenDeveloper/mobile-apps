import React, { Component } from "react";
import { Text, View, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { withNavigation } from "react-navigation";

import Lang from "../../utils/Lang";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import ContentRow from "../../ecosystems/ContentRow";
import relativeTime from "../../utils/RelativeTime";
import SearchResultItem from "./SearchResultItem";
import SearchResultComment from "./SearchResultComment";
import styles, { styleVars } from "../../styles";

class SearchResult extends Component {
	render() {
		let onPress;
		const isSupported = isSupportedUrl([this.props.data.url.app, this.props.data.url.module, this.props.data.url.controller]);

		if (isSupported) {
			onPress = () =>
				this.props.navigation.navigate( isSupported, {
					id: this.props.data.itemID,
					findComment: this.props.data.isComment ? this.props.data.objectID : null
				});
		} else {
			onPress = () =>
				this.props.navigation.navigate("WebView", {
					url: this.props.data.url.full
				});
		}

		const ResultComponent = this.props.data.isComment || this.props.data.isReview ? SearchResultComment : SearchResultItem;

		return (
			<ContentRow style={componentStyles.result} onPress={onPress}>
				<ResultComponent data={this.props.data} term={this.props.term} />
			</ContentRow>
		);
	}
}

export default compose(withNavigation)(SearchResult);

const componentStyles = StyleSheet.create({
	result: {
		paddingVertical: styleVars.spacing.wide
	}
});
