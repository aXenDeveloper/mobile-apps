import React, { Component } from "react";
import { Text, View, Button, SectionList, TouchableHighlight } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { setForumPassword } from "../../redux/actions/forums";
import SectionHeader from "../../atoms/SectionHeader";
import ForumItem from "../../ecosystems/ForumItem";
import TextPrompt from "../../ecosystems/TextPrompt";

const ForumQuery = gql`
	query ForumQuery {
		forums {
			forums {
				id
				name
				topicCount
				postCount
				subforums {
					id
					name
					topicCount
					postCount
					hasUnread
					passwordProtected
					passwordRequired
					lastPostAuthor {
						photo
					}
					lastPostDate
				}
			}
		}
	}
`;

class ForumListScreen extends Component {
	static navigationOptions = {
		title: "Forums"
	};

	constructor(props) {
		super(props);

		this.state = {
			textPromptVisible: false
		};
	}

	/**
	 * Render a forum row
	 *
	 * @param 	object 	item 	The forum item to render
	 * @return 	void
	 */
	renderItem(item) {
		const params = {
			id: item.data.id,
			title: item.data.title,
			subtitle: Lang.pluralize(Lang.get("topics"), item.data.topics)
		};

		const regularNavigate = () => {
			this.props.navigation.navigate("TopicList", params);
		};

		const passwordPrompt = () => {
			this.setState({
				textPromptVisible: true,
				textPromptParams: params
			});
		};

		let handler;
		if( !item.data.passwordRequired || ( item.data.passwordRequired && !_.isUndefined( this.props.forums[ item.data.id ] ) ) ){
			handler = regularNavigate;
		} else {
			handler = passwordPrompt;
		}

		return (
			<ForumItem key={item.key} data={item.data} onPress={handler} />
		);
	}

	passwordSubmit(password) {
		const params = this.state.textPromptParams;

		this.props.dispatch(setForumPassword({
			forumID: params.id,
			password
		}));

		this.closePasswordDialog();
		this.props.navigation.navigate("TopicList", params);
	}

	closePasswordDialog() {
		this.setState({ 
			textPromptVisible: false,
			textPromptParams: null
		})
	}

	render() {
		if (this.props.data.loading || this.props.data.error) {
			console.log(this.props.data.error);
			return <View repeat={7}>{this.props.data.error ? <Text>Error</Text> : <Text>Loading</Text>}</View>;
		} else {
			const sectionData = this.props.data.forums.forums.map(category => {
				return {
					title: category.name,
					data: category.subforums.map(forum => ({
						key: forum.id,
						data: {
							id: forum.id,
							unread: forum.hasUnread,
							title: forum.name,
							topics: parseInt(forum.topicCount),
							posts: parseInt(forum.postCount) + parseInt(forum.topicCount),
							lastPostPhoto: forum.lastPostAuthor ? forum.lastPostAuthor.photo : null,
							lastPostDate: forum.lastPostDate,
							passwordProtected: forum.passwordProtected,
							passwordRequired: forum.passwordRequired
						}
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
						submitText={Lang.get('go')}
						textInputProps={{
							autoCapitalize: 'none',
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