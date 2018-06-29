import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import TagEdit from "../../ecosystems/TagEdit";
import { QuillEditor, QuillToolbar } from "../../ecosystems/Editor";
import uniqueID from "../../utils/UniqueID";
import styles from "../../styles";

const CreateTopicMutation = gql`
	mutation CreateTopicMutation($forumID: ID!, $title: String!, $content: String!) {
		mutateForums {
			createTopic(forumID: $forumID, title: $title, content: $content) {
				id
				url
				tags {
					name
				}
				locked
				posts {
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
	}
`;

class CreateTopicScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Create Topic",
			headerTintColor: "white",
			headerLeft: (
				<Text style={{ color: "#fff" }} onPress={navigation.getParam("cancelTopic")}>
					Cancel
				</Text>
			),
			headerRight: (
				<Text style={{ color: "#fff" }} onPress={navigation.getParam("submitTopic")}>
					Post
				</Text>
			)
		};
	};

	/**
	 * Constructor
	 *
	 * @param 	object 	props
	 * @return 	void
	 */
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			content: ""
		};
		this.editorID = uniqueID();
	}

	/**
	 * Mount
	 */
	componentDidMount() {
		this.props.navigation.setParams({
			submitTopic: this.submitTopic.bind(this),
			cancelTopic: this.cancelTopic.bind(this)
		});
	}

	/**
	 * Event handler for clicking the Cancel button in the modal
	 *
	 * @return 	void
	 */
	cancelTopic() {
		if (this.state.title || this.state.content) {
			Alert.alert(
				"Confirm",
				"Are you sure you want to discard this topic without posting?",
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

	/**
	 * Event handler for lcicking the Post button in the modal
	 *
	 * @return 	void
	 */
	async submitTopic() {
		if (!this.state.title) {
			Alert.alert("Title Required", "You must enter a topic title.", [{ text: "OK" }], { cancelable: false });
			return;
		}

		if (!this.state.content) {
			Alert.alert("Post Required", "You must enter a post.", [{ text: "OK" }], { cancelable: false });
			return;
		}

		try {
			await this.props.mutate({
				variables: {
					forumID: this.props.navigation.state.params.forumID,
					title: this.state.title,
					content: this.state.content
				},
				refetchQueries: ["TopicListQuery"]
			});

			this.props.navigation.goBack();
		} catch (err) {
			Alert.alert("Error", "Sorry, there was an error posting this topic", [{ text: "OK" }], { cancelable: false });
		}
	}

	/**
	 * Event handler passed into our Editor, allowing us to modify the state with the given content
	 *
	 * @param 	string 	content 	The editor content
	 * @return 	void
	 */
	updateContentState(content) {
		this.setState({
			content
		});
	}

	/**
	 * Render
	 */
	render() {
		return (
			<React.Fragment>
				<KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
					<TextInput style={[styles.field, styles.fieldText]} placeholder="Topic Title" onChangeText={text => this.setState({ title: text })} />
					<TagEdit definedTags={this.props.navigation.state.params.definedTags || null} />
					<QuillEditor placeholder="Post" update={this.updateContentState.bind(this)} style={{ flex: 1 }} editorID={this.editorID} />
				</KeyboardAvoidingView>
				<QuillToolbar editorID={this.editorID} />
			</React.Fragment>
		);
	}
}

export default graphql(CreateTopicMutation)(CreateTopicScreen);
