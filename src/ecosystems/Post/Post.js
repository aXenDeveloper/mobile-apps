import React, { Component } from "react";
import { Button, Image, Alert, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity, Share } from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "react-native-actionsheet";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import * as Animatable from "react-native-animatable";
import { withNavigation } from "react-navigation";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import { WhoReactedModal, WhoReactedFragment } from "../../ecosystems/Reaction";
import ShadowedArea from "../../atoms/ShadowedArea";
import ViewMeasure from "../../atoms/ViewMeasure";
import UserPhoto from "../../atoms/UserPhoto";
import PostControls from "../../atoms/PostControls";
import PostControl from "../../atoms/PostControl";
import RichTextContent from "../../ecosystems/RichTextContent";
import Reaction from "../../atoms/Reaction";
import ReactionModal from "../../atoms/ReactionModal";
import CommentFlag from "../../atoms/CommentFlag";
import relativeTime from "../../utils/RelativeTime";
import getErrorMessage from "../../utils/getErrorMessage";
import PostFragment from "./PostFragment";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

const PostReactionMutation = gql`
	mutation PostReactionMutation($postID: ID!, $reactionID: Int, $removeReaction: Boolean) {
		mutateForums {
			postReaction(postID: $postID, reactionID: $reactionID, removeReaction: $removeReaction) {
				...PostFragment
			}
		}
	}
	${PostFragment}
`;

const WhoReactedQuery = gql`
	query WhoReactedQuery($id: ID!, $reactionID: Int) {
		app: forums {
			type: post(id: $id) {
				reputation {
					whoReacted(id: $reactionID) {
						...WhoReactedFragment
					}
				}
			}
		}
	}
	${WhoReactedFragment}
`;

const ReportPostMutation = gql`
	mutation ReportPostMutation($id: ID!, $reason: Int, $additionalInfo: String) {
		mutateForums {
			reportPost(id: $id, reason: $reason, additionalInfo: $additionalInfo) {
				...PostFragment
			}
		}
	}
	${PostFragment}
`;

const RevokeReportMutation = gql`
	mutation RevokeReportMutation($id: ID!, $reportID: ID!) {
		mutateForums {
			revokePostReport(id: $id, reportID: $reportID) {
				...PostFragment
			}
		}
	}
	${PostFragment}
`;

class Post extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reactionModalVisible: false,
			whoReactedModalVisible: false,
			whoReactedCount: 0,
			whoReactedReaction: 0,
			whoReactedImage: "",
			ignoreOverride: false
		};
		this.onPressReaction = this.onPressReaction.bind(this);
		this.onPressProfile = this.onPressProfile.bind(this);
		this.hideWhoReactedModal = this.hideWhoReactedModal.bind(this);
		this.onPressReply = this.onPressReply.bind(this);
		this.hideReactionModal = this.hideReactionModal.bind(this);
		this.onLongPressReputation = this.onLongPressReputation.bind(this);
		this.onPressReputation = this.onPressReputation.bind(this);
		this.onReactionPress = this.onReactionPress.bind(this);
		this.onPressPostDots = this.onPressPostDots.bind(this);
		this.onPressIgnoredPost = this.onPressIgnoredPost.bind(this);
		this.onShare = this.onShare.bind(this);
		this.actionSheetPress = this.actionSheetPress.bind(this);
	}

	/**
	 * GraphQL error types
	 */
	static errors = {
		NO_POST: Lang.get("no_post")
	};

	//====================================================================
	// LOADING
	/**
	 * Return the loading placeholder
	 *
	 * @return 	Component
	 */
	loadingComponent() {
		return (
			<ShadowedArea style={[componentStyles.post, styles.pWide, styles.mbVeryTight]}>
				<PlaceholderContainer height={40}>
					<PlaceholderElement circle radius={40} left={0} top={0} />
					<PlaceholderElement width={160} height={15} top={0} left={50} />
					<PlaceholderElement width={70} height={14} top={23} left={50} />
				</PlaceholderContainer>
				<PlaceholderContainer height={100} style={styles.mvWide}>
					<PlaceholderElement width="100%" height={12} />
					<PlaceholderElement width="70%" height={12} top={20} />
					<PlaceholderElement width="82%" height={12} top={40} />
					<PlaceholderElement width="97%" height={12} top={60} />
				</PlaceholderContainer>
			</ShadowedArea>
		);
	}

	//====================================================================
	// ACTION SHEET CONFIG

	/**
	 * Handle tapping an action sheet item
	 *
	 * @return 	void
	 */
	actionSheetPress(i) {
		if (i === 1) {
			if (this.props.data.commentPermissions.canShare) {
				this.onShare();
			} else {
				this.onReport();
			}
		} else if (i > 1) {
			this.onReport();
		}
	}

	/**
	 * Return the options to be shown in the action sheet
	 *
	 * @return 	array
	 */
	actionSheetOptions() {
		const options = [Lang.get("cancel")];

		if (this.props.data.commentPermissions.canShare) {
			options.push(Lang.get("share"));
		}
		if (this.props.data.commentPermissions.canReportOrRevoke) {
			options.push(Lang.get("report"));
		}

		return options;
	}

	/**
	 * Return the index of the 'cancel' option
	 *
	 * @return 	number
	 */
	actionSheetCancelIndex() {
		return 0;
	}

	//====================================================================

	/**
	 * Handle tapping a reaction count
	 *
	 * @param 	number 		reactionID 		ID of tapped reaction
	 * @return 	void
	 */
	onPressReaction(reaction) {
		this.setState({
			whoReactedModalVisible: true,
			whoReactedReaction: reaction.id,
			whoReactedCount: reaction.count || 0,
			whoReactedImage: reaction.image
		});
	}

	/**
	 * Hide the Who Reacted modal
	 *
	 * @return 	void
	 */
	hideWhoReactedModal() {
		this.setState({
			whoReactedModalVisible: false
		});
	}

	/**
	 * Called onLongPress on the react button; trigger the modal
	 *
	 * @return 	void
	 */
	showReactionModal() {
		this.setState({
			reactionModalVisible: true
		});
	}

	/**
	 * This method is passed as a callback into the reaction modal, to allow it
	 * to close itself.
	 *
	 * @return 	void
	 */
	hideReactionModal() {
		this.setState({
			reactionModalVisible: false
		});
	}

	/**
	 * Render the PostControl for the reaction button
	 *
	 * @return 	Component
	 */
	getReputationButton() {
		if (!this.props.data.reputation.canReact) {
			return null;
		}

		if (this.props.data.reputation.hasReacted) {
			return (
				<PostControl
					testId="repButton"
					image={this.props.data.reputation.givenReaction.image}
					label={this.props.data.reputation.givenReaction.name}
					selected
					onPress={this.onPressReputation}
					onLongPress={this.onLongPressReputation}
				/>
			);
		} else {
			return (
				<PostControl
					testId="repButton"
					image={icons.HEART}
					label={this.props.data.reputation.defaultReaction.name}
					onPress={this.onPressReputation}
					onLongPress={this.onLongPressReputation}
				/>
			);
		}
	}

	/**
	 * Handle long press on rep button. Only do something if we aren't using
	 * like mode
	 *
	 * @return 	void
	 */
	onLongPressReputation() {
		if (this.props.data.reputation.isLikeMode) {
			return null;
		}

		return this.showReactionModal();
	}

	/**
	 * Handle regular press on reputation. Apply our default rep if not already reacted,
	 * otherwise remove current rep
	 *
	 * @return 	void
	 */
	onPressReputation() {
		if (this.props.data.reputation.hasReacted) {
			this.removeReaction();
		} else {
			this.onReactionPress(this.props.data.reputation.defaultReaction.id);
		}
	}

	/**
	 * A callback method for removing a reaction from the post
	 * Calls a mutation to update the user's choice of reaction.
	 *
	 * @return 	void
	 */
	async removeReaction() {
		try {
			await this.props.mutate({
				variables: {
					postID: this.props.data.id,
					removeReaction: true
				},
				// This is a little difficult to understand, but basically we must return a data structure
				// in *exactly* the same format that the server will send us. That means we have to manually
				// specify the __typenames too where they don't already exist in the fetched data.
				optimisticResponse: {
					mutateForums: {
						__typename: "mutate_Forums",
						postReaction: {
							...this.props.data,
							reputation: {
								...this.props.data.reputation,
								hasReacted: false,
								givenReaction: null
							}
						}
					}
				}
			});
		} catch (err) {
			const errorMessage = getErrorMessage(err, Post.errors);
			Alert.alert(Lang.get("error"), Lang.get("error_remove_reaction"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	/**
	 * A callback method passed into the reaction modal to handle tapping a reaction choice.
	 * Calls a mutation to update the user's choice of reaction.
	 *
	 * @param 	number 		reaction 		ID of selected reaction
	 * @return 	void
	 */
	async onReactionPress(reaction) {
		// Get the reaction object from available reactions
		const givenReaction = _.find(this.props.data.reputation.availableReactions, function(type) {
			return type.id === reaction;
		});

		try {
			await this.props.mutate({
				variables: {
					postID: this.props.data.id,
					reactionID: reaction
				},
				// This is a little difficult to understand, but basically we must return a data structure
				// in *exactly* the same format that the server will send us. That means we have to manually
				// specify the __typenames too where they don't already exist in the fetched data.
				optimisticResponse: {
					mutateForums: {
						__typename: "mutate_Forums",
						postReaction: {
							...this.props.data,
							reputation: {
								...this.props.data.reputation,
								hasReacted: true,
								givenReaction: {
									__typename: "core_Reaction",
									id: givenReaction.id,
									name: givenReaction.name,
									image: givenReaction.image
								}
							}
						}
					}
				}
			});
		} catch (err) {
			// @todo abstract/improve errors
			const errorMessage = getErrorMessage(err, Post.errors);
			Alert.alert(Lang.get("error"), Lang.get("error_reacting"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	/**
	 * On update, check whether our reaction count has changed. If so, animate the reaction wrap in
	 *
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		if (!this.props.loading) {
			if (prevProps.data.reputation.reactions.length == 0 && this.props.data.reputation.reactions.length !== 0) {
				this._reactionWrap.fadeInRight(200);
			}
		}
	}

	/**
	 * Handler for tapping the author to go to profile
	 *
	 * @return 	void
	 */
	onPressProfile() {
		this.props.navigation.navigate("Profile", {
			id: this.props.data.author.id,
			name: this.props.data.author.name,
			photo: this.props.data.author.photo
		});
	}

	/**
	 * Handler for tapping the Reply button
	 *
	 * @return 	void
	 */
	onPressReply() {
		this.props.navigation.navigate("ReplyTopic", {
			topicID: this.props.topic.id,
			quotedPost: this.props.data
		});
	}

	/**
	 * Handler for tapping ... in a post for more options
	 *
	 * @return 	void
	 */
	onPressPostDots() {
		this._actionSheet.show();
	}

	/**
	 * Handler for showing/hiding an ignored post
	 *
	 * @return 	void
	 */
	onPressIgnoredPost() {
		this.setState({
			ignoreOverride: !this.state.ignoreOverride
		});
	}

	/**
	 * Handles launching the share dialog
	 *
	 * @return 	void
	 */
	async onShare() {
		try {
			const result = await Share.share(
				{
					message: this.props.shareTitle,
					url: this.props.data.url.full
				},
				{
					dialogTitle: this.props.shortShareTitle || "",
					subject: this.props.shortShareTitle || ""
				}
			);
		} catch (err) {
			console.warn("Failed to share");
			Alert.alert(Lang.get("error"), Lang.get("error_sharing_content"), [{ text: Lang.get("ok") }], { cancelable: false });
		}
	}

	/**
	 * Handles launching the share dialog
	 *
	 * @return 	void
	 */
	onReport() {
		// @todo language
		this.props.navigation.navigate("ReportContent", {
			id: this.props.data.id,
			contentTitle: this.props.topic.title,
			thingTitle: `${this.props.data.author.name}'s post`,
			reportData: this.props.data.reportStatus,
			reportMutation: ReportPostMutation,
			revokeReportMutation: RevokeReportMutation
		});
	}

	/**
	 * Render the ignored post wrapper (used when the user has ignored this user but hasn't chosen to show it manually)
	 *
	 * @return 	Component
	 */
	renderIgnoredPost() {
		return <View style={styles.mbVeryTight}>{this.renderIgnoreBar()}</View>;
	}

	/**
	 * Render the bar that indicates this post is ignored
	 *
	 * @return 	Component
	 */
	renderIgnoreBar() {
		return (
			<ShadowedArea style={this.state.ignoreOverride ? styles.lightBackground : null}>
				<TouchableOpacity style={[styles.flexRow, styles.flexJustifyBetween, styles.pvStandard, styles.phWide]} onPress={this.onPressIgnoredPost}>
					<Text style={[styles.standardText, styles.veryLightText]}>{Lang.get("ignoring_user")}</Text>
					<Text style={[styles.standardText, styles.accentText]}>{Lang.get(this.state.ignoreOverride ? "hide" : "show")}</Text>
				</TouchableOpacity>
			</ShadowedArea>
		);
	}

	/**
	 * Render the corner 'highlighted' badge if necessary
	 *
	 * @return 	Component|null
	 */
	renderCommentFlag() {
		if (!this.props.site.settings.reputation_enabled || !this.props.site.settings.reputation_highlight) {
			return null;
		}

		if (this.props.data.reputation.reactionCount >= this.props.site.settings.reputation_highlight) {
			return <CommentFlag />;
		}

		return null;
	}

	/**
	 * Render a message explaining the post is hidden
	 *
	 * @return 	Component|null
	 */
	renderHiddenMessage() {
		const data = this.props.data;

		if (data.hiddenStatus === null) {
			return null;
		}

		const statuses = {
			HIDDEN: ["Hidden", "This post is only visible to moderators", icons.HIDDEN],
			DELETED: ["Deleted", "This post is pending deletion", icons.CROSS_CIRCLE_SOLID],
			PENDING: ["Pending Approval", "This post is pending approval by a moderator", icons.PENDING]
		};

		return (
			<View style={[styles.moderatedBackground, styles.mtWide, styles.pWide, styles.flexRow, componentStyles.hiddenMessage]}>
				<Image source={statuses[data.hiddenStatus][2]} resizeMode="contain" style={componentStyles.hiddenMessageIcon} />
				<View style={[styles.flexGrow, styles.flexBasisZero, styles.mlTight]}>
					<Text style={[styles.contentText, styles.mediumText, styles.moderatedTitle]}>{statuses[data.hiddenStatus][0]}</Text>
					<Text style={[styles.standardText, styles.moderatedText]}>{statuses[data.hiddenStatus][1]}</Text>
				</View>
			</View>
		);
	}

	render() {
		if (this.props.loading) {
			return this.loadingComponent();
		}

		if (this.props.data.isIgnored && !this.state.ignoreOverride) {
			return this.renderIgnoredPost();
		}

		const repButton = this.getReputationButton();
		const postData = this.props.data;
		// <Text>{this.props.position}</Text>

		return (
			<ViewMeasure onLayout={this.props.onLayout} id={parseInt(this.props.data.id)}>
				<View style={styles.mbVeryTight}>
					{Boolean(postData.isIgnored) && Boolean(this.state.ignoreOverride) && this.renderIgnoreBar()}
					<ShadowedArea style={[styles.pvWide, componentStyles.post, this.props.style]}>
						{this.props.topComponent}
						<View style={styles.flexRow}>
							{this.props.leftComponent}
							<View style={[this.props.leftComponent ? styles.mrWide : styles.mhWide, styles.flexBasisZero, styles.flexGrow]}>
								<View style={[styles.flexRow, styles.flexAlignStart]} testId="postAuthor">
									<TouchableOpacity style={styles.flex} onPress={postData.author.id ? this.onPressProfile : null}>
										<View style={[styles.flex, styles.flexRow, styles.flexAlignStart]}>
											<UserPhoto url={postData.author.photo} online={postData.author.isOnline || null} size={36} />
											<View style={[styles.flexColumn, styles.flexJustifyCenter, styles.mlStandard]}>
												<Text style={styles.itemTitle}>{postData.author.name}</Text>
												<Text style={[styles.standardText, styles.lightText]}>{relativeTime.long(postData.timestamp)}</Text>
											</View>
										</View>
									</TouchableOpacity>
									{Boolean(postData.commentPermissions.canShare || postData.commentPermissions.canReportOrRevoke) && (
										<TouchableOpacity style={styles.flexAlignSelfStart} onPress={this.onPressPostDots}>
											<Image style={componentStyles.postMenu} resizeMode="contain" source={icons.DOTS} />
										</TouchableOpacity>
									)}
								</View>
								{Boolean(postData.hiddenStatus !== null) && this.renderHiddenMessage()}
								<View style={styles.mvWide}>
									<RichTextContent>{postData.content.original}</RichTextContent>
									<Animatable.View ref={r => (this._reactionWrap = r)}>
										{Boolean(postData.reputation.reactions.length) && (
											<View style={[styles.mtWide, styles.flexRow, styles.flexJustifyEnd, styles.flexWrap]} testId="reactionList">
												{postData.reputation.reactions.map(reaction => {
													return (
														<Reaction
															style={styles.mlStandard}
															key={reaction.id}
															id={reaction.id}
															image={reaction.image}
															count={reaction.count}
															onPress={postData.reputation.canViewReps ? this.onPressReaction : null}
														/>
													);
												})}
											</View>
										)}
									</Animatable.View>
								</View>
							</View>
						</View>
						{Boolean(repButton || this.props.canReply) && (
							<PostControls style={styles.mhWide}>
								{Boolean(this.props.canReply) && this.props.hiddenStatus === null && (
									<PostControl testId="replyButton" image={icons.QUOTE} label={Lang.get("quote")} onPress={this.onPressReply} />
								)}
								{repButton}
							</PostControls>
						)}
						{Boolean(postData.commentPermissions.canShare || postData.commentPermissions.canReportOrRevoke) && (
							<ActionSheet
								ref={o => (this._actionSheet = o)}
								title={Lang.get("post_options")}
								options={this.actionSheetOptions()}
								cancelButtonIndex={this.actionSheetCancelIndex()}
								onPress={this.actionSheetPress}
							/>
						)}
						<ReactionModal
							visible={this.state.reactionModalVisible}
							closeModal={this.hideReactionModal}
							reactions={postData.reputation.availableReactions}
							onReactionPress={this.onReactionPress}
						/>
						<WhoReactedModal
							visible={this.state.whoReactedModalVisible}
							close={this.hideWhoReactedModal}
							expectedCount={this.state.whoReactedCount}
							reactionImage={this.state.whoReactedImage}
							query={WhoReactedQuery}
							variables={{
								id: postData.id,
								reactionID: parseInt(this.state.whoReactedReaction)
							}}
						/>
						{this.renderCommentFlag()}
					</ShadowedArea>
				</View>
			</ViewMeasure>
		);
	}
}

export default compose(
	graphql(PostReactionMutation),
	withNavigation,
	connect(state => ({
		site: state.site
	}))
)(Post);

export { Post as TestPost }; // For test runner only

const componentStyles = StyleSheet.create({
	post: {
		//padding: styleVars.spacing.wide,
		paddingBottom: 0
	},
	postMenu: {
		width: 24,
		height: 24,
		opacity: 0.5
	},
	hiddenMessage: {
		marginHorizontal: styleVars.spacing.wide * -1
	},
	hiddenMessageIcon: {
		width: 14,
		height: 14,
		tintColor: styleVars.moderatedText.title,
		marginTop: 2
	}
});
