import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { NavigationActions, Header } from "react-navigation";
import { connect } from "react-redux";

import TagEdit from "../../ecosystems/TagEdit";
import { QuillEditor, QuillToolbar } from "../../ecosystems/Editor";
import HeaderButton from "../../atoms/HeaderButton";
import uniqueID from "../../utils/UniqueID";
import styles from "../../styles";

const CreateTopicMutation = gql`
	mutation CreateTopicMutation($forumID: ID!, $title: String!, $content: String!, $tags: [String], $postKey: String!) {
		mutateForums {
			createTopic(forumID: $forumID, title: $title, content: $content, tags: $tags, postKey: $postKey) {
				__typename
				id
				isHidden
				url {
					__typename
					full
					app
					module
					controller
				}
			}
		}
	}
`;

class CreateTopicScreen extends Component {
	// @todo language
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Create Topic",
			headerTintColor: "white",
			headerLeft: <HeaderButton position="left" onPress={navigation.getParam("cancelTopic")} label="Cancel" />,
			headerRight: <HeaderButton position="right" onPress={navigation.getParam("submitTopic")} label="Post" />
		};
	};

	static errors = {
		NO_FORUM: "The forum does not exist.",
		NO_TITLE: "You didn't provide a title.",
		NO_POST: "You didn't provide a post"
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
			content: "",
			tags: []
		};
		this.editorID = uniqueID();

		this.updateTags = this.updateTags.bind(this);
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
		// @todo language
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
		// @todo language
		if (!this.state.title) {
			Alert.alert("Title Required", "You must enter a topic title.", [{ text: "OK" }], { cancelable: false });
			return;
		}

		if (!this.state.content) {
			Alert.alert("Post Required", "You must enter a post.", [{ text: "OK" }], { cancelable: false });
			return;
		}

		if (this.props.site.settings.tags_enabled && this.props.user.group.canTag) {
			if (this.props.site.settings.tags_max && this.state.tags.length > this.props.site.settings.tags_max) {
				Alert.alert("Too Many Tags", `There is a maximum of ${this.props.site.settings.tags_max} tags allowed.`, [{ text: "OK" }], { cancelable: false });
				return;
			}

			if (this.props.site.settings.tags_min && this.state.tags.length < this.props.site.settings.tags_min) {
				Alert.alert("Not Enough Tags", `You must provide at least ${this.props.site.settings.tags_min} tags.`, [{ text: "OK" }], { cancelable: false });
				return;
			}
		}

		try {
			const { data } = await this.props.mutate({
				variables: {
					forumID: this.props.navigation.state.params.forumID,
					title: this.state.title,
					content: this.state.content,
					tags: this.state.tags,
					postKey: this.editorID
				},
				refetchQueries: ["TopicListQuery"]
			});

			const newTopicData = data.mutateForums.createTopic;
			const navigateAction = NavigationActions.navigate({
				params: {
					highlightTopic: newTopicData.id
				},
				routeName: "TopicList"
			});
			this.props.navigation.dispatch(navigateAction);
		} catch (err) {
			console.log(err);
			const errorMessage = getErrorMessage(err, CreateTopicScreen.errors);
			Alert.alert("Error", "Sorry, there was an error posting this topic." + errorMessage, [{ text: "OK" }], { cancelable: false });
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

	updateTags(tagData) {
		this.setState({
			tags: tagData.tags
		});
	}

	/**
	 * Render
	 */
	render() {
		const settings = this.props.site.settings;
		// @todo language
		return (
			<React.Fragment>
				<KeyboardAvoidingView style={styles.flex} enabled behavior="padding">
					<TextInput style={[styles.field, styles.fieldText]} placeholder="Topic Title" onChangeText={text => this.setState({ title: text })} />
					{Boolean(this.props.site.settings.tags_enabled) && Boolean(this.props.user.group.canTag) && (
						<TagEdit
							definedTags={this.props.navigation.state.params.definedTags || null}
							maxTags={settings.tags_max}
							minTags={settings.tags_min}
							maxTagLen={settings.tags_len_max}
							minTagLen={settings.tags_len_min}
							minRequiredIfAny={settings.tags_min_req}
							onSubmit={this.updateTags}
							freeChoice={settings.tags_open_system}
						/>
					)}
					<QuillEditor
						placeholder="Post"
						update={this.updateContentState.bind(this)}
						style={styles.flex}
						editorID={this.editorID}
						uploadData={this.props.navigation.state.params.uploadData}
					/>
				</KeyboardAvoidingView>
				<QuillToolbar editorID={this.editorID} />
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(CreateTopicMutation),
	connect(state => ({
		site: state.site,
		user: state.user
	}))
)(CreateTopicScreen);
