import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import ForumItemFragment from "./ForumItemFragment";
import Lang from "../../utils/Lang";
import ContentRow from "../../ecosystems/ContentRow";
import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import ForumIcon from '../../atoms/ForumIcon';
import LastPostInfo from '../../ecosystems/LastPostInfo';
import styles, { styleVars } from '../../styles';

const MarkForumRead = gql`
	mutation MarkForumRead($id: ID!) {
		mutateForums {
			markForumRead(id: $id) {
				...ForumItemFragment
			}
		}
	}
	${ForumItemFragment}
`;

class ForumItem extends Component {	
	constructor(props) {
		super(props);
		this._swipeable = null;
		this._markReadTimeout = null;
	}

	componentWillUnmount() {
		clearTimeout( this._markReadTimeout );
	}

	/**
	 * Event handler for tappig a forum row
	 *
	 * @param 	object 	section 	The section we're rendering
	 * @return 	Component|null
	 */
	onPress = () => {
		this.props.navigation.navigate({
			routeName: "TopicList",
			params: {
				id: this.props.data.id,
				title: this.props.data.title,
				subtitle: Lang.pluralize(Lang.get("topics"), this.props.data.topics)
			},
			key: `forum_${this.props.data.id}`
		});
	}

	markForumRead = () => {
		this._swipeable.recenter();

		this._markReadTimeout = setTimeout( async () => {
			try {
				await this.props.client.mutate({
					mutation: MarkForumRead,
					variables: {
						id: this.props.data.id
					},
					optimisticResponse: {
						mutateForums: {
							__typename: "mutate_Forums",
							markForumRead: {
								...this.props.data,
								hasUnread: false
							}
						}
					}
				});
			} catch (err) {
				console.log(err);

				Alert.alert(
					"Couldn't mark as read", 
					"There was an error marking this forum as read",
					[{ text: Lang.get('ok') }], 
					{ cancelable: false }
				);
			}
		}, 500 );
	}

	render() {
		if( this.props.loading ){
			return (
				<ContentRow>
					<PlaceholderContainer height={60} style={[styles.mrWide, styles.mlWide, styles.mtTight, styles.mbTight]}>
						<PlaceholderElement circle radius={20} left={0} top={styleVars.spacing.tight} />
						<PlaceholderElement width={250} height={17} top={styleVars.spacing.tight} left={20 + styleVars.spacing.standard} right={20 + styleVars.spacing.veryWide} />
						<PlaceholderElement width={100} height={13} top={25 + styleVars.spacing.tight} left={20 + styleVars.spacing.standard} />
						<PlaceholderElement circle radius={30} right={0} top={0} />
						<PlaceholderElement width={30} height={12} top={33} right={4} />
					</PlaceholderContainer>
				</ContentRow>
			);
		}

		const rightButtons = [ // @todo handle this event
			<TouchableHighlight style={[styles.rightSwipeItem, styles.markSwipeItem]} onPress={this.markForumRead}>
				<Text style={styles.swipeItemText}>Mark Read</Text>
			</TouchableHighlight>
		];

		return (
			<Swipeable rightButtons={rightButtons} onRef={(ref) => this._swipeable = ref}>
				<ContentRow style={componentStyles.forumItem} onPress={this.props.onPress || this.onPress}>
					<View style={componentStyles.iconAndInfo}>
						<ForumIcon style={componentStyles.forumIcon} unread={this.props.data.unread} />
						<View style={componentStyles.forumInfo}>
							<Text style={[styles.itemTitle, componentStyles.forumTitle]} numberOfLines={1}>
								{this.props.data.title}
							</Text>
							<Text style={[styles.lightText, styles.standardText]}>
								{Lang.pluralize( Lang.get('posts'), this.props.data.posts)}
							</Text>
						</View>
					</View>
					<LastPostInfo style={componentStyles.lastPost} photo={this.props.data.lastPostPhoto} photoSize={30} timestamp={this.props.data.lastPostDate} />
				</ContentRow>
			</Swipeable>
		);
	}
}

export default compose(
	withNavigation,
	withApollo
)(ForumItem);

const componentStyles = StyleSheet.create({
	forumItem: {
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.wide,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch',
		alignItems: 'center',
	},
	iconAndInfo: {
		flexDirection: 'row',
		flex: 1,
		paddingRight: 20
	},
	forumInfo: {
		marginLeft: 9
	},
	forumTitle: {
		lineHeight: 18
	}
});