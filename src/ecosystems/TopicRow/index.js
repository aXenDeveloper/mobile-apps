import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableHighlight } from "react-native";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import Lang from "../../utils/Lang";
import getSuitableImage from "../../utils/getSuitableImage";
import relativeTime from "../../utils/RelativeTime";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import ShadowedArea from "../../atoms/ShadowedArea";
import UserPhoto from "../../atoms/UserPhoto";
import TopicIcon from "../../atoms/TopicIcon";
import LockedIcon from "../../atoms/LockedIcon";
import TopicStatus from "../../atoms/TopicStatus";
import LastPostInfo from "../../ecosystems/LastPostInfo";
import ContentRow from "../../ecosystems/ContentRow";
import styles, { styleVars } from "../../styles.js";

class TopicRow extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Return the placeholder component structure
	 *
	 * @return 	Component
	 */
	loadingComponent() {
		return (
			<ContentRow withSpace>
				<PlaceholderContainer height={48} style={componentStyles.topicRowLoading}>
					<PlaceholderElement width="80%" height={15} top={4} />
					<PlaceholderElement width="70%" height={12} top={26} />
					<PlaceholderElement circle radius={30} right={0} top={0} />
				</PlaceholderContainer>
				<PlaceholderContainer height={20} style={componentStyles.topicStatusesLoading}>
					<PlaceholderElement width="30%" height={14} />
				</PlaceholderContainer>
			</ContentRow>
		);
	}

	/**
	 * Return a suitable thumbnail for the topic, if available
	 *
	 * @return 	Component|null
	 */
	getThumbnail() {
		const suitableImage = getSuitableImage(this.props.data.contentImages);

		if (suitableImage) {
			return <Image source={{ url: suitableImage }} resizeMode="cover" style={componentStyles.thumbnailImage} />;
		}

		return null;
	}

	/**
	 * Event handler for tapping on the topic row
	 *
	 * @return 	void
	 */
	onPress = () => {
		this.props.navigation.navigate("TopicView", {
			id: this.props.item.id,
			title: this.props.item.title,
			author: this.props.item.author,
			posts: this.props.item.replies,
			started: this.props.item.started
		});
	};

	render() {
		if (this.props.loading) {
			return this.loadingComponent();
		}

		// Only show as unread if we're a member and unread flag is true
		const showAsUnread = this.props.auth.authenticated && this.props.data.unread;
		const image = this.getThumbnail();

		return (
			<ContentRow withSpace unread={showAsUnread} onPress={this.props.onPress || this.onPress}>
				<View style={[componentStyles.topicRowInner, image !== null ? componentStyles.topicRowInnerWithImage : null]}>
					<View style={componentStyles.topicInfo}>
						<View style={componentStyles.topicTitle}>
							{showAsUnread && <TopicIcon style={componentStyles.topicIcon} unread={this.props.data.unread} />}
							<Text style={[componentStyles.topicTitleText, showAsUnread ? styles.title : styles.titleRead]} numberOfLines={1}>
								{this.props.data.title}
							</Text>
						</View>
						<Text style={[componentStyles.topicSnippet, showAsUnread ? styles.text : styles.textRead]} numberOfLines={1}>
							{this.props.data.snippet}
						</Text>
					</View>
					<View style={componentStyles.thumbnail}>{image}</View>
				</View>
				<View style={componentStyles.topicStatusesWrap}>
					<View style={componentStyles.topicMeta}>
						{this.props.data.hot && <TopicStatus style={componentStyles.topicStatus} textStyle={componentStyles.topicStatusesText} type="hot" />}
						{this.props.data.pinned && (
							<TopicStatus style={componentStyles.topicStatus} textStyle={componentStyles.topicStatusesText} type="pinned" />
						)}

						<Text style={[componentStyles.topicStatusesText, componentStyles.topicMetaText, componentStyles.lastPostTime]}>
							{relativeTime.short(this.props.data.lastPostDate)}
						</Text>

						<Text style={[componentStyles.topicStatusesText, componentStyles.topicMetaText]}>
							{Lang.pluralize(Lang.get("replies"), this.props.data.replies)}
						</Text>
					</View>
				</View>
			</ContentRow>
		);
	}
}

export default compose(
	withNavigation,
	connect(state => ({
		auth: state.auth
	}))
)(TopicRow);

const componentStyles = StyleSheet.create({
	// Loading styles
	topicRowLoading: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingVertical: 10
	},
	topicStatusesLoading: {
		backgroundColor: "#FAFAFA",
		height: 32,
		paddingHorizontal: 15,
		paddingVertical: 8
	},

	// Regular styles
	topicRowInner: {
		paddingLeft: 15,
		paddingRight: 16,
		paddingVertical: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "stretch"
	},
	topicRowInnerWithImage: {
		paddingRight: 90
	},
	topicInfo: {
		flex: 1,
		paddingTop: 4,
		paddingRight: 20
	},
	topicIcon: {
		marginTop: 5,
		marginRight: 4,
		alignSelf: "flex-start"
	},
	lockedIcon: {
		marginTop: 3,
		alignSelf: "flex-start",
		width: 12,
		height: 12
	},
	topicTitle: {
		marginBottom: 2,
		flexDirection: "row"
	},
	topicTitleText: {
		fontSize: 17,
		fontWeight: "600",
		color: "#000"
	},
	topicSnippet: {
		fontSize: 15,
		color: "#000",
		marginBottom: 4
	},
	lastPoster: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		marginRight: styleVars.spacing.tight
	},
	lastPostTime: {
		marginRight: styleVars.spacing.wide
	},
	lastPosterPhoto: {
		marginRight: styleVars.spacing.veryTight
	},
	topicStatusesWrap: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#FAFAFA",
		height: 32,
		paddingHorizontal: 15
	},
	topicStatus: {
		marginRight: styleVars.spacing.wide
	},
	topicStatusesText: {
		fontSize: 13,
		color: styleVars.lightText
	},
	topicMeta: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	topicMetaText: {
		opacity: 0.9
	},
	repliesIcon: {
		width: 14,
		height: 14,
		tintColor: styleVars.lightText,
		marginRight: styleVars.spacing.veryTight,
		opacity: 0.5
	},
	thumbnail: {
		width: 75,
		position: "absolute",
		right: 8,
		top: 8,
		bottom: 8
	},
	thumbnailImage: {
		...StyleSheet.absoluteFillObject
	}
});
