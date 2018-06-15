import React, { Component } from "react";
import { Text, TextInput, View, KeyboardAvoidingView } from "react-native";
import CustomHeader from "../ecosystems/CustomHeader";
import TagEdit from "../ecosystems/TagEdit";
import { QuillEditor } from "../ecosystems/Editor";
import styles from "../styles";

export default class CreateTopicScreen extends Component {
	static navigationOptions = {
		title: "Create Topic",
		headerTitle: "Create Topic",
		headerTitleStyle: styles.headerTitle,
		headerStyle: styles.altHeader,
		headerTintColor: "white",
		headerLeft: <Text style={{color: '#fff'}} onPress={() => console.log("Post")}>Cancel</Text>,
		headerRight: <Text style={{color: '#fff'}} onPress={() => console.log("Hello")}>Post</Text>
	};

	constructor(props) {
		super(props);
		this.state = {
			title: ""
		};
	}

	render() {
		console.log( this.props );

		return (
			<KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
				<TextInput style={[styles.field, styles.fieldText]} placeholder="Topic Title" onChangeText={text => this.setState({ title: text })} />
				<TagEdit definedTags={this.props.navigation.state.params.definedTags || null} />
				<QuillEditor placeholder="Topic Content" />
			</KeyboardAvoidingView>
		);
	}
}
