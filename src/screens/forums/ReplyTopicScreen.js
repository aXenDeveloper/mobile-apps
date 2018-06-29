import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions } from "react-navigation";
import { QuillEditor, QuillToolbar } from "../../ecosystems/Editor";
import RichTextContent from "../../atoms/RichTextContent";
import UserPhoto from "../../atoms/UserPhoto";
import relativeTime from "../../utils/RelativeTime";
import styles from "../../styles";

const ReplyTopicMutation = gql`
	mutation ReplyTopicMutation($topicID: ID!, $content: String!, $replyingTo: ID) {
		mutateForums {
			replyTopic(topicID: $topicID, content: $content, replyingTo: $replyingTo) {
				id
				url
				timestamp
				author {
					id
					photo
					name
				}
				content
				reputation {
					canViewReps
					reactions {
						id
						image
						name
						count
					}
				}
			}
		}
	}
`;

class ReplyTopicScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Reply To Topic",
			headerTintColor: "white",
			headerLeft: (
				<Text style={{ color: "#fff" }} onPress={navigation.getParam("cancelReply")}>
					Cancel
				</Text>
			),
			headerRight: (
				<Text style={{ color: "#fff" }} onPress={navigation.getParam("submitReply")}>
					Post
				</Text>
			)
		};
	};

	constructor(props) {
		super(props);
		this.offset = null;
		this.state = {
			content: ""
		};
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

		try {
			await this.props.mutate({
				variables: {
					topicID: this.props.navigation.state.params.topicID,
					content: this.state.content,
					replyingTo: this.props.navigation.state.params.quotedPost.id || null
				},
				refetchQueries: ["TopicViewQuery", "TopicListQuery"]
			});

			const navigateAction = NavigationActions.navigate({
				params: { goToEnd: true },
				routeName: "TopicView"
			});
			this.props.navigation.dispatch(navigateAction);
			//this.props.navigation.goBack();
		} catch (err) {
			Alert.alert("Error", "Sorry, there was an error posting this reply: " + err.message, [{ text: "OK" }], { cancelable: false });
		}
	}

	/**
	 * Cancel replying to the topic
	 *
	 * @return 	void
	 */
	cancelReply() {

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
						<RichTextContent>{quotedPost.content}</RichTextContent>
					</View>
				</View>
			);
		}

		return (
			<React.Fragment>
				<ScrollView ref={scrollview => (this.scrollview = scrollview)} style={{ flex: 1 }}>
					{quotedPostComponent}
					<KeyboardAvoidingView style={{ flex: 1 }} enabled>
						<QuillEditor
							placeholder="Your Reply"
							update={this.updateContentState.bind(this)}
							height={400}
							autoFocus
							onFocus={measurer => {
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
							}}
						/>
					</KeyboardAvoidingView>
				</ScrollView>
				<QuillToolbar />
			</React.Fragment>
		);
	}
}

export default graphql(ReplyTopicMutation)(ReplyTopicScreen);

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