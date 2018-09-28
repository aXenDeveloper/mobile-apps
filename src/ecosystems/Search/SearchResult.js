import React, { Component } from "react";
import { Text, View, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { withNavigation } from "react-navigation";

import Lang from "../../utils/Lang";
import highlightTerms from "../../utils/highlightTerms";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import ContentRow from "../../ecosystems/ContentRow";
import UserPhoto from "../../atoms/UserPhoto";
import relativeTime from '../../utils/RelativeTime';
import styles, { styleVars } from '../../styles';


class SearchResult extends Component {

	renderItem() {
		return (
			<React.Fragment>
				<View style={componentStyles.itemHeader}>
					<View style={componentStyles.itemUserInfo}>
						<UserPhoto size={22} url={this.props.data.author.photo} />
						<Text style={componentStyles.itemUsername}>{this.props.data.author.name}</Text>
					</View>
					<Text style={[styles.lightText]}>{relativeTime.short(this.props.data.updated)}</Text>
				</View>
				<View style={componentStyles.itemBody}>
					<Text style={componentStyles.itemTitle} numberOfLines={1}>{highlightTerms(this.props.data.title, this.props.term, componentStyles.highlight)}</Text>
					<Text style={componentStyles.itemContent} numberOfLines={2}>
						{highlightTerms(this.props.data.content.trim(), this.props.term, componentStyles.highlight)}
					</Text>
				</View>
				<View style={componentStyles.itemMeta}>
					<Text style={styles.lightText} numberOfLines={1}>
						{Lang.pluralize( Lang.get('replies'), this.props.data.replies )} &middot; {this.props.data.articleLang.definiteUC} in {this.props.data.containerTitle}
					</Text>
				</View>
			</React.Fragment>
		);
	}

	renderComment() {
		return (
			<Text>comment</Text>
		);
	}

	render() {
		let onPress;
		const isSupported = isSupportedUrl([
			this.props.data.url.app,
			this.props.data.url.module,
			this.props.data.url.controller
		]);

		if (isSupported) {
			onPress = () =>
				this.props.navigation.navigate(isSupported, {
					id: this.props.data.itemID
				});
		} else {
			onPress = () =>
				this.props.navigation.navigate("WebView", {
					url: this.props.data.url.full
				});
		}

		let content;

		if( this.props.data.isComment || this.props.data.isReview ){
			content = this.renderComment();
		} else {
			content = this.renderItem();
		}

		return (
			<ContentRow style={componentStyles.result} onPress={onPress}>
				{content}
			</ContentRow>
		);
	}
}

export default compose(
	withNavigation
)(SearchResult);

const componentStyles = StyleSheet.create({
	result: {
		paddingVertical: styleVars.spacing.standard,
	},
	itemHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: styleVars.spacing.wide
	},
	itemUserInfo: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	itemUsername: {
		fontSize: styleVars.fontSizes.content,
		marginLeft: styleVars.spacing.tight,
		fontFamily: 'System'
	},
	itemBody: {
		marginTop: styleVars.spacing.tight,
		marginHorizontal: styleVars.spacing.wide
	},
	itemTitle: {
		fontSize: styleVars.fontSizes.large,
		fontWeight: 'bold',
		fontFamily: 'System'
	},
	itemContent: {
		fontSize: styleVars.fontSizes.content,
		fontFamily: 'System'
	},
	itemMeta: {
		marginHorizontal: styleVars.spacing.wide,
		marginTop: styleVars.spacing.tight
	},
	highlight: {
		backgroundColor: styleVars.searchHighlight,
		color: styleVars.searchHighlightText
	}
});