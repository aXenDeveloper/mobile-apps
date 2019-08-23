import React, { Component } from "react";
import { Text, View, Button, SectionList, TouchableHighlight } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
import formatNumber from "../../utils/formatNumber";
import { setForumPassword } from "../../redux/actions/forums";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import SectionHeader from "../../atoms/SectionHeader";
import { ForumItem, ForumItemFragment } from "../../ecosystems/ForumItem";
import TextPrompt from "../../ecosystems/TextPrompt";

const ForumQuery = gql`
	query ForumQuery {
		forums {
			forums {
				...ForumItemFragment
			}
		}
	}
	${ForumItemFragment}
`;

class ForumListScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: Lang.get("forums")
	});

	constructor(props) {
		super(props);

		this._onPressHandlers = {};
		this.state = {
			textPromptVisible: false
		};
	}

	/**
	 * Memoization function that returns an onpress handler for a given forum
	 *
	 * @param 	object 	item 	The forum item to render
	 * @return 	void
	 */
	getOnPressHandler(forum) {
		if (_.isUndefined(this._onPressHandlers[forum.id])) {
			if (forum.isRedirectForum) {
				// Redirect forum - so open webview
				this._onPressHandlers[forum.id] = () => {
					this.props.navigation.navigate("WebView", {
						url: forum.url.full
					});
				};
			} else if (forum.passwordRequired && !_.isUndefined(this.props.forums[forum.id])) {
				// Password-protected forum that we don't have a stored password for - show prompt
				this._onPressHandlers[forum.id] = () => {
					this.setState({
						textPromptVisible: true,
						textPromptParams: {
							id: forum.id
						}
					});
				};
			} else {
				// Other forums - just navigate
				this._onPressHandlers[forum.id] = () => {
					this.props.navigation.navigate("TopicList", {
						id: forum.id,
						title: forum.name,
						subtitle: Lang.pluralize(Lang.get("topics"), formatNumber(forum.topicCount))
					});
				};
			}
		}

		return this._onPressHandlers[forum.id];
	}

	/**
	 * Render a forum row
	 *
	 * @param 	object 	item 	The forum item to render
	 * @return 	void
	 */
	renderItem(item) {
		const handler = this.getOnPressHandler(item.data);

		return <ForumItem key={item.key} data={item.data} onPress={handler} />;
	}

	/**
	 * Handle the submit event in the password modal
	 *
	 * @param 	string 	password 	The entered password
	 * @return 	void
	 */
	passwordSubmit(password) {
		const params = this.state.textPromptParams;

		this.props.dispatch(
			setForumPassword({
				forumID: params.id,
				password
			})
		);

		this.closePasswordDialog();
		this.props.navigation.navigate("TopicList", params);
	}

	/**
	 * Handle closing the password modal
	 *
	 * @return 	void
	 */
	closePasswordDialog() {
		this.setState({
			textPromptVisible: false,
			textPromptParams: null
		});
	}

	render() {
		if (this.props.data.loading) {
			return (
				<PlaceholderRepeater repeat={7}>
					<ForumItem loading />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			return <Text>Error</Text>; // @todo
		} else {
			const sectionData = this.props.data.forums.forums.map(category => {
				return {
					title: category.name,
					data: category.subforums.map(forum => ({
						key: forum.id,
						data: forum
					}))
				};
			});

			return (
				<View style={{ flexGrow: 1 }}>
					<SectionList
						renderItem={({ item }) => this.renderItem(item)}
						renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
						sections={sectionData}
					/>
					<TextPrompt
						placeholder={Lang.get("password")}
						isVisible={this.state.textPromptVisible}
						title={Lang.get("enter_password")}
						message={Lang.get("forum_requires_password")}
						close={this.closePasswordDialog.bind(this)}
						submit={this.passwordSubmit.bind(this)}
						submitText={Lang.get("go")}
						textInputProps={{
							autoCapitalize: "none",
							autoCorrect: false,
							secureTextEntry: true,
							spellCheck: false
						}}
					/>
				</View>
			);
		}
	}
}

export default compose(
	graphql(ForumQuery),
	connect(state => ({
		auth: state.auth,
		forums: state.forums
	}))
)(ForumListScreen);
