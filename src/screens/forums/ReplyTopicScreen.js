import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, ScrollView, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { NavigationActions, Header } from "react-navigation";
import { connect } from "react-redux";
import _ from "underscore";

import getErrorMessage from "../../utils/getErrorMessage";
import { QuillEditor, QuillToolbar } from "../../ecosystems/Editor";
import { PostFragment } from "../../ecosystems/Post";
import RichTextContent from "../../ecosystems/RichTextContent";
import UserPhoto from "../../atoms/UserPhoto";
import HeaderButton from "../../atoms/HeaderButton";
import uniqueID from "../../utils/UniqueID";
import Lang from "../../utils/Lang";
import relativeTime from "../../utils/RelativeTime";
import styles from "../../styles";

const ReplyTopicMutation = gql`
	mutation ReplyTopicMutation($topicID: ID!, $content: String!, $replyingTo: ID) {
		mutateForums {
			replyTopic(topicID: $topicID, content: $content, replyingTo: $replyingTo) {
				...PostFragment
			}
		}
	}
	${PostFragment}
`;

class ReplyTopicScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: navigation.getParam("submitting") ? (
				<React.Fragment>
					<ActivityIndicator size="small" color="#fff" />
					<Text style={styles.headerTitle}> Submitting...</Text>
				</React.Fragment>
			) : (
				"Reply"
			),
			headerTintColor: "white",
			headerLeft: navigation.getParam("submitting") ? null : <HeaderButton position="left" label="Cancel" onPress={navigation.getParam("cancelReply")} />,
			headerRight: navigation.getParam("submitting") ? null : <HeaderButton position="right" label="Post" onPress={navigation.getParam("submitReply")} />
		};
	};

	static errors = {
		NO_TOPIC: "The topic you are replying to does not exist.",
		NO_POST: "You didn't provide a post."
	};

	constructor(props) {
		super(props);
		this.offset = null;

		this.editorID = uniqueID();
		this.state = {
			content: ""
		};

		this._onBlurCallback = null;

		this.updateContentState = this.updateContentState.bind(this);
	}

	/**
	 * Set navigation params as function references so the header buttons work
	 *
	 * @return 	void
	 */
	componentDidMount() {
		this.props.navigation.setParams({
			submitReply: this.submitReply.bind(this),
			cancelReply: this.cancelReply.bind(this)
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.submitting !== this.state.submitting) {
			this.props.navigation.setParams({
				submitting: this.state.submitting
			});

			if (this._onBlurCallback && this.state.submitting) {
				this._onBlurCallback();
			}
		}
	}

	/**
	 * Callback to store editor content in state
	 *
	 * @param 	string 		content 	Content HTML provided by editor
	 * @return 	void
	 */
	updateContentState(content) {
		this.setState({
			content
		});
	}

	/**
	 * Event handler for lcicking the Post button in the modal
	 *
	 * @return 	void
	 */
	async submitReply() {
		if (!this.state.content) {
			Alert.alert("Post Required", "You must enter a post.", [{ text: "OK" }], { cancelable: false });
			return;
		}

		this.setState({
			submitting: true
		});

		try {
			await this.props.mutate({
				variables: {
					topicID: this.props.navigation.state.params.topicID,
					content: this.state.content,
					replyingTo: !_.isUndefined(this.props.navigation.state.params.quotedPost) ? this.props.navigation.state.params.quotedPost.id : null
				},
				refetchQueries: ["TopicViewQuery", "TopicListQuery"]
			});

			const navigateAction = NavigationActions.navigate({
				params: {
					showLastComment: true
				},
				routeName: "TopicView"
			});
			this.props.navigation.dispatch(navigateAction);
			//this.props.navigation.goBack();
		} catch (err) {
			this.setState({
				submitting: false
			});

			const errorMessage = getErrorMessage(err, ReplyTopicScreen.errors);
			Alert.alert("Error", "Sorry, there was an error posting this reply. " + err, [{ text: "OK" }], { cancelable: false });
		}
	}

	/**
	 * Cancel replying to the topic
	 *
	 * @return 	void
	 */
	cancelReply() {
		if (this.state.content) {
			Alert.alert(
				"Confirm",
				"Are you sure you want to discard this reply without posting?",
				[
					{
						text: "Discard",
						onPress: () => {
							this.props.navigation.goBack();
						},
						style: "cancel"
					},
					{
						text: "Stay Here",
						onPress: () => console.log("OK Pressed")
					}
				],
				{ cancelable: false }
			);
		} else {
			this.props.navigation.goBack();
		}
	}

	render() {
		// If we're quoting an existing post, build that now
		let quotedPostComponent = null;
		if (this.props.navigation.state.params.quotedPost) {
			const quotedPost = this.props.navigation.state.params.quotedPost;

			quotedPostComponent = (
				<View style={componentStyles.postInfo}>
					<UserPhoto url={quotedPost.author.photo} size={36} />
					<View style={componentStyles.postContent}>
						<Text style={componentStyles.quotingTitle}>Quoting {quotedPost.author.name}:</Text>
						<RichTextContent removeQuotes>{quotedPost.content.original}</RichTextContent>
					</View>
				</View>
			);
		}

		return (
			<React.Fragment>
				<ScrollView ref={scrollview => (this.scrollview = scrollview)} style={{ flex: 1, backgroundColor: "#fff" }}>
					{quotedPostComponent}
					<KeyboardAvoidingView style={{ flex: 1 }} enabled>
						<QuillEditor
							placeholder="Your Reply"
							update={this.updateContentState}
							height={400}
							autoFocus={!_.isObject(this.props.navigation.state.params.quotedPost)}
							editorID={this.editorID}
							receiveOnBlurCallback={callback => (this._onBlurCallback = callback)}
							enabled={!this.state.submitting}
							onFocus={measurer => {
								// If we're quoting a post, we'll scroll the view up
								// so that the editor is near the top when focused
								if (this.props.navigation.state.params.quotedPost) {
									if (this.offset) {
										this.scrollview.scrollTo({
											x: 0,
											y: this.offset,
											animated: true
										});
									} else {
										measurer.measure((fx, fy, width, height, px, py) => {
											this.offset = py - 120;
											this.scrollview.scrollTo({
												x: 0,
												y: py - 120,
												animated: true
											});
										});
									}
								}
							}}
						/>
					</KeyboardAvoidingView>
				</ScrollView>
				<QuillToolbar editorID={this.editorID} />
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(ReplyTopicMutation),
	connect(state => ({
		attachedImages: state.editor.attachedImages
	}))
)(ReplyTopicScreen);

const componentStyles = StyleSheet.create({
	postInfo: {
		flexDirection: "row",
		alignItems: "flex-start",
		padding: 12,
		backgroundColor: "#fafafa",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.05)"
	},
	postContent: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: 9
	},
	quotingTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#171717",
		marginBottom: 3
	}
});
