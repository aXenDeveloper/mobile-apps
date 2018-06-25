import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, KeyboardAvoidingView } from "react-native";
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import CustomHeader from "../ecosystems/CustomHeader";
import TagEdit from "../ecosystems/TagEdit";
import { QuillEditor } from "../ecosystems/Editor";
import styles from "../styles";

const CreateTopicMutation = gql`
	mutation CreateTopicMutation($forumID: ID!, $title: String!, $post: String!) {
		forumsMutations {
			createTopic(forumID: $forumID, title: $title, post: $post) {
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
			/*headerTitleStyle: styles.headerTitle,
			headerStyle: styles.altHeader,*/
			headerTintColor: "white",
			headerLeft: <Text style={{color: '#fff'}} onPress={() => console.log("Post")}>Cancel</Text>,
			headerRight: <Text style={{color: '#fff'}} onPress={navigation.getParam('submitTopic')}>Post</Text>
		};
	};

	constructor(props) {
		super(props);
		this.state = {
			title: "",
			content: ""
		};
	}

	componentDidMount () {
		this.props.navigation.setParams({
			submitTopic: this.submitTopic.bind(this)
		});
	}

	submitTopic() {
		if( !this.state.title ){
			// No title
		}

		Alert.alert(
			this.state.title,
			this.state.content,
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{ cancelable: false }
		);

		/*this.props.mutate({
			forumID: 1,
			title: this.state.title,
			post: "This is a post, I'll figure out the details later..."
		});*/
	}

	updateContentState(content) {
		this.setState({
			content
		});
	}

	render() {
		console.log( this.props );

		return (
			<KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
				<TextInput style={[styles.field, styles.fieldText]} placeholder="Topic Title" onChangeText={text => this.setState({ title: text })} />
				<TagEdit definedTags={this.props.navigation.state.params.definedTags || null} />
				<QuillEditor placeholder="Topic Content" update={this.updateContentState.bind(this)} />
			</KeyboardAvoidingView>
		);
	}
}


export default graphql( CreateTopicMutation )( CreateTopicScreen );