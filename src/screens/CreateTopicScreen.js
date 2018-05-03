import React, { Component } from "react";
import { Text, TextInput, View, KeyboardAvoidingView } from "react-native";
import CustomHeader from "../ecosystems/CustomHeader";
import { QuillEditor } from "../ecosystems/Editor";
import styles from "../styles";

export default class CreateTopicScreen extends Component {
	static navigationOptions = {
		title: "Create Topic",
		headerTitle: "Create Topic",
		headerTitleStyle: styles.headerTitle,
		headerStyle: styles.altHeader,
		headerBackTitleStyle: styles.headerBack,
		headerTintColor: "white",
		headerBackTitle: null,
		headerLeft: <Text>Cancel</Text>,
		headerRight: <Text>Post</Text>
	};

	constructor(props) {
		super(props);
		this.state = {
			title: ""
		};
	}

	render() {
		return (
			<KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
				<TextInput style={styles.field} placeholder="Topic Title" onChangeText={text => this.setState({ title: text })} />
				<QuillEditor placeholder="Topic Content" />
			</KeyboardAvoidingView>
		);
	}
}
