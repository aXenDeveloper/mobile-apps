import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, KeyboardAvoidingView, ActivityIndicator, Platform } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { NavigationActions, Header } from "react-navigation";
import { connect } from "react-redux";
import _ from "underscore";

import TagEdit from "../../ecosystems/TagEdit";
import { QuillEditor, QuillToolbar } from "../../ecosystems/Editor";
import { UPLOAD_STATUS } from "../../redux/actions/editor";
import HeaderButton from "../../atoms/HeaderButton";
import uniqueID from "../../utils/UniqueID";
import styles from "../../styles";
import icons from "../../icons";

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
			headerTitle: navigation.getParam("submitting") ? (
				<React.Fragment>
					<ActivityIndicator size="small" color="#fff" />
					<Text style={styles.headerTitle}> Submitting...</Text>
				</React.Fragment>
			) : (
				"New Topic"
			),
			headerTintColor: "white",
			//headerLeft: navigation.getParam("submitting") ? null : <HeaderButton position="left" onPress={navigation.getParam("cancelTopic")} label="Cancel" />,
			headerRight: navigation.getParam("submitting") ? null : (
				<HeaderButton position="right" onPress={navigation.getParam("submitTopic")} label="Post" icon={icons.SUBMIT} />
			)
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
			tags: [],
			submitting: false
		};
		this.editorID = uniqueID();
		this._onBlurCallback = null;

		this.updateTags = this.updateTags.bind(this);
		this.updateContentState = this.updateContentState.bind(this);
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
	 * Check state for submitting flag
	 *
	 * @return 	void
	 */
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
		console.log("submit topic");

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

		// Check for any uploading files
		const attachedImages = this.props.attachedImages;
		const uploadingFiles = Object.keys(attachedImages).find(
			imageID => [UPLOAD_STATUS.UPLOADING, UPLOAD_STATUS.PENDING].indexOf(attachedImages[imageID].status) !== -1
		);

		if (!_.isUndefined(uploadingFiles)) {
			Alert.alert("Uploads In Progress", "Please wait until your uploaded images have finished processing, then submit again.", [{ text: "OK" }], {
				cancelable: false
			});
			return;
		}

		this.setState({
			submitting: true
		});

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
			this.setState({
				submitting: false
			});

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
					<TextInput
						style={[styles.field, styles.fieldText]}
						placeholder="Topic Title"
						editable={!this.state.submitting}
						onChangeText={text => this.setState({ title: text })}
					/>
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
						update={this.updateContentState}
						style={styles.flex}
						editorID={this.editorID}
						enabled={!this.state.submitting}
						receiveOnBlurCallback={callback => (this._onBlurCallback = callback)}
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
		user: state.user,
		attachedImages: state.editor.attachedImages
	}))
)(CreateTopicScreen);
