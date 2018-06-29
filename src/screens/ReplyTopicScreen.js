import React, { Component } from "react";
import { Text, Alert, Button, TextInput, View, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { QuillEditor, QuillToolbar } from "../ecosystems/Editor";
import RichTextContent from "../atoms/RichTextContent";
import UserPhoto from "../atoms/UserPhoto";
import relativeTime from "../utils/RelativeTime";
import styles from "../styles";

export default class ReplyTopicScreen extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: "Reply To Topic",
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

	constructor(props) {
		super(props);
		this.offset = null;
		this.state = {
			content: ""
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({
			submitTopic: this.submitTopic.bind(this),
			cancelTopic: this.cancelTopic.bind(this)
		});
	}

	updateContentState(content) {
		this.setState({
			content
		});
	}

	submitTopic() {}

	cancelTopic() {}

	render() {
		let quotedPostComponent = null;

		if (this.props.navigation.state.params.quotedPost) {
			const quotedPost = this.props.navigation.state.params.quotedPost;

			quotedPostComponent = (
				<View style={componentStyles.postInfo}>
					<UserPhoto url={quotedPost.author.photo} size={36} />
					<View style={componentStyles.postContent}>
						<Text style={componentStyles.quotingTitle}>Quoting {quotedPost.author.name}</Text>
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
