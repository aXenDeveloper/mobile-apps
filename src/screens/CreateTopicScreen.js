import React, { Component } from 'react';
import { Text, View } from 'react-native';
import CustomHeader from '../ecosystems/CustomHeader';
import { QuillEditor } from '../ecosystems/Editor';
import styles from '../styles';

export default class CreateTopicScreen extends Component {
	static navigationOptions = {
		title: 'Create Topic',
		headerTitle: "Create Topic",
		headerTitleStyle: styles.headerTitle,
		headerStyle: styles.altHeader,
		headerBackTitleStyle: styles.headerBack,
		headerTintColor: "white",
		headerBackTitle: null,
		headerLeft: ( <Text>Cancel</Text> ),
		headerRight: ( <Text>Post</Text> ),

	};
	
	render() {
		return (
			<View style={{ flex: 1 }}>
				<QuillEditor />
			</View>
		);
	}
}