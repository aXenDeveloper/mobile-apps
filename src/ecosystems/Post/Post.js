import React, { Component } from "react";
import { Button, Image, Alert, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "react-native-actionsheet";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import * as Animatable from 'react-native-animatable';
import { withNavigation } from "react-navigation";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import ShadowedArea from "../../atoms/ShadowedArea";
import UserPhoto from "../../atoms/UserPhoto";
import PostControls from "../../atoms/PostControls";
import PostControl from "../../atoms/PostControl";
import RichTextContent from "../../atoms/RichTextContent";
import Reaction from "../../atoms/Reaction";
import ReactionModal from "../../atoms/ReactionModal";
import relativeTime from "../../utils/RelativeTime";
import getErrorMessage from "../../utils/getErrorMessage";
import PostFragment from "./PostFragment";
import { styleVars } from "../../styles";

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

class Post extends Component {
	constructor(props) {
		super(props);
		this._actionSheetOptions = [Lang.get('cancel'), Lang.get('share'), Lang.get('report')];
		this.state = {
			reactionModalVisible: false
		};
	}

	/**
	 * GraphQL error types
	 */
	static errors = {
		NO_POST: Lang.get('no_post')
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
			<ShadowedArea style={[styles.post, styles.postWrapper]}>
				<PlaceholderContainer height={40}>
					<PlaceholderElement circle radius={40} left={0} top={0} />
					<PlaceholderElement width={160} height={15} top={0} left={50} />
					<PlaceholderElement width={70} height={14} top={23} left={50} />
				</PlaceholderContainer>
				<PlaceholderContainer height={100} style={styles.postContentContainer}>
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
		console.log("action sheet");
	}

	/**
	 * Return the options to be shown in the action sheet
	 *
	 * @return 	array
	 */
	actionSheetOptions() {
		return this._actionSheetOptions;
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
	onPressReaction = (reactionID) => {
		if (this.props.data.reputation.canViewReps) {
			console.log("press reaction"); // @todo show follow list
		}
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
	hideReactionModal = () => {
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
					image={this.props.data.reputation.givenReaction.image}
					label={this.props.data.reputation.givenReaction.name}
					selected
					onPress={this.onPressReputation}
					onLongPress={this.onLongPressReputation}
				/>
			);
		} else {
			return <PostControl label={this.props.data.reputation.defaultReaction.name} onPress={this.onPressReputation} onLongPress={this.onLongPressReputation} />;
		}
	}

	/**
	 * Handle long press on rep button. Only do something if we aren't using
	 * like mode
	 *
	 * @return 	void
	 */
	onLongPressReputation = () => {
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
	onPressReputation = () => {
		if( this.props.data.reputation.hasReacted ){
			this.removeReaction();
		} else {
			this.onReactionPress( this.props.data.reputation.defaultReaction.id );
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
			// @todo abstract/improve error
			const errorMessage = getErrorMessage(err, Post.errors);
			Alert.alert("Error", "Sorry, there was an error removing the reaction from this post." + err, [{ text: "OK" }], { cancelable: false });
		}
	}

	/**
	 * A callback method passed into the reaction modal to handle tapping a reaction choice.
	 * Calls a mutation to update the user's choice of reaction.
	 *
	 * @param 	number 		reaction 		ID of selected reaction
	 * @return 	void
	 */
	onReactionPress = async (reaction) => {
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
			Alert.alert("Error", "Sorry, there was an error reacting to this post." + errorMessage, [{ text: "OK" }], { cancelable: false });
		}
	}

	/**
	 * On update, check whether our reaction count has changed. If so, animate the reaction wrap in
	 *
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		if( !this.props.loading ){
			if( prevProps.data.reputation.reactions.length == 0 && this.props.data.reputation.reactions.length !== 0 ){
				this._reactionWrap.fadeInRight(200);
			}
		}
	}

	/**
	 * Handler for tapping the author to go to profile
	 *
	 * @return 	void
	 */
	onPressProfile = () => {
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
	onPressReply = () => {
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
	onPressPostDots = () => {
		this._actionSheet.show();
	}

	render() {
		if (this.props.loading) {
			return this.loadingComponent();
		}

		const repButton = this.getReputationButton();

		return (
			<TouchableHighlight style={styles.postWrapper}>
				<ShadowedArea style={styles.post}>
					<View style={styles.postHeader}>
						<TouchableOpacity style={styles.postInfo} onPress={this.onPressProfile}>
							<View style={styles.postInfo}>
								<UserPhoto url={this.props.data.author.photo} online={this.props.data.author.isOnline || null} size={36} />
								<View style={styles.meta}>
									<Text style={styles.username}>{this.props.data.author.name}</Text>
									<Text style={styles.date}>{relativeTime.long(this.props.data.timestamp)}</Text>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={styles.postInfoButton} onPress={this.onPressPostDots}>
							<Image style={styles.postMenu} resizeMode="contain" source={require("../../../resources/dots.png")} />
						</TouchableOpacity>
					</View>
					<View style={styles.postContentContainer}>
						<RichTextContent>{this.props.data.content}</RichTextContent>
						<Animatable.View ref={(r) => this._reactionWrap = r}>
							{this.props.data.reputation.reactions.length && (
								<View style={[ styles.postReactionList ]}>
									{this.props.data.reputation.reactions.map(reaction => {
										return (
											<Reaction
												style={styles.reactionItem}
												key={reaction.id}
												id={reaction.id}
												image={reaction.image}
												count={reaction.count}
												onPress={this.onPressReaction}
											/>
										);
									})}
								</View>
							)}
						</Animatable.View>
					</View>
					{(repButton || this.props.canReply) &&
						<PostControls>
							{this.props.canReply && <PostControl label={Lang.get('quote')} onPress={this.onPressReply} />}
							{repButton}
						</PostControls>}
					<ActionSheet
						ref={o => (this._actionSheet = o)}
						title={Lang.get('post_options')}
						options={this.actionSheetOptions()}
						cancelButtonIndex={this.actionSheetCancelIndex()}
						onPress={this.actionSheetPress}
					/>
					<ReactionModal
						visible={this.state.reactionModalVisible}
						closeModal={this.hideReactionModal}
						reactions={this.props.data.reputation.availableReactions}
						onReactionPress={this.onReactionPress}
					/>
				</ShadowedArea>
			</TouchableHighlight>
		);
	}
}

export default compose(
	graphql(PostReactionMutation),
	withNavigation
)(Post);

const styles = StyleSheet.create({
	postWrapper: {
		marginBottom: 7
	},
	post: {
		padding: 16,
		paddingBottom: 0
	},
	postHeader: {
		flexDirection: "row",
		alignItems: "flex-start"
	},
	postInfo: {
		flexDirection: "row",
		alignItems: "flex-start",
		flex: 1
	},
	meta: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: 9
	},
	username: {
		fontSize: styleVars.fontSizes.large,
		fontWeight: "600",
		color: "#171717"
	},
	date: {
		fontSize: styleVars.fontSizes.standard,
		color: "#8F8F8F"
	},
	postContentContainer: {
		marginTop: 16,
		marginBottom: 16
	},
	postMenu: {
		width: 24,
		height: 24,
		opacity: 0.5
	},
	postInfoButton: {
		alignSelf: "flex-start"
	},
	postReactionList: {
		display: "flex",
		justifyContent: "flex-end",
		flexWrap: "wrap",
		flexDirection: "row",
		marginTop: 15,
	},
	reactionItem: {
		marginLeft: 10
	}
});
