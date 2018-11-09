import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import Lang from "../../utils/Lang";
import ContentRow from "../../ecosystems/ContentRow";
import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import ForumIcon from '../../atoms/ForumIcon';
import LastPostInfo from '../../ecosystems/LastPostInfo';
import styles, { styleVars } from '../../styles';

class ForumItem extends Component {	
	constructor(props) {
		super(props);
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

	render() {
		if( this.props.loading ){
			return (
				<ContentRow>
					<PlaceholderContainer height={60} style={[styles.mrWide, styles.mlWide, styles.mtStandard, styles.mbStandard]}>
						<PlaceholderElement circle radius={20} left={0} top={styleVars.spacing.tight} />
						<PlaceholderElement width={250} height={17} top={styleVars.spacing.tight} left={20 + styleVars.spacing.standard} right={20 + styleVars.spacing.veryWide} />
						<PlaceholderElement width={100} height={13} top={25 + styleVars.spacing.tight} left={20 + styleVars.spacing.standard} />
						<PlaceholderElement circle radius={40} right={0} top={0} />
						<PlaceholderElement width={30} height={12} top={43} right={4} />
					</PlaceholderContainer>
				</ContentRow>
			);
		}

		const rightButtons = [ // @todo handle this event
			<TouchableHighlight style={[styles.rightSwipeItem, styles.markSwipeItem]}>
				<Text style={styles.swipeItemText}>Read</Text>
			</TouchableHighlight>
		];

		return (
			<Swipeable rightButtons={rightButtons}>
				<ContentRow style={componentStyles.forumItem} onPress={this.props.onPress || this.onPress}>
					<View style={componentStyles.iconAndInfo}>
						<ForumIcon style={componentStyles.forumIcon} unread={this.props.data.unread} />
						<View style={componentStyles.forumInfo}>
							<Text style={componentStyles.forumTitle} numberOfLines={1}>
								{this.props.data.title}
							</Text>
							<Text style={componentStyles.forumMeta}>
								{Lang.pluralize( Lang.get('posts'), this.props.data.posts)}
							</Text>
						</View>
					</View>
					<LastPostInfo style={componentStyles.lastPost} photo={this.props.data.lastPostPhoto} timestamp={this.props.data.lastPostDate} />
				</ContentRow>
			</Swipeable>
		);
	}
}

export default compose(
	withNavigation
)(ForumItem);

const componentStyles = StyleSheet.create({
	forumItem: {
		paddingHorizontal: 16,
		paddingVertical: 9,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch',
		alignItems: 'center',
		minHeight: 75
	},
	forumTitle: {
		fontSize: 17,
		color: '#000',
		fontWeight: "600",
		lineHeight: 18,
		marginBottom: 3,
		letterSpacing: -0.2
	},
	iconAndInfo: {
		flexDirection: 'row',
		flex: 1,
		paddingRight: 20
	},
	forumInfo: {
		marginLeft: 9
	},
	forumMeta: {
		fontSize: 15,
		color: '#8F8F8F',
		letterSpacing: -0.2
	}
});