import React, { Component } from "react";
import { Text, View, Button, SectionList, TouchableHighlight } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
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

		const redirectNavigate = () => {
			this.props.navigation.navigate("WebView", {
				url: item.data.url.full
			});
		};

		let handler;
		if( item.data.isRedirectForum ) {
			handler = redirectNavigate;
		} else if( !item.data.passwordRequired || ( item.data.passwordRequired && !_.isUndefined( this.props.forums[ item.data.id ] ) ) ){
			handler = regularNavigate;
		} else {
			handler = passwordPrompt;
		}

		return (
			<ForumItem key={item.key} data={item.data} onPress={handler} />
		);
	}

	/**
	 * Handle the submit event in the password modal
	 *
	 * @param 	string 	password 	The entered password
	 * @return 	void
	 */
	passwordSubmit(password) {
		const params = this.state.textPromptParams;

		this.props.dispatch(setForumPassword({
			forumID: params.id,
			password
		}));

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
		})
	}

	render() {
		if (this.props.data.loading ) {
			return (
				<PlaceholderRepeater repeat={7}>
					<ForumItem loading />
				</PlaceholderRepeater>
			);
		} else if ( this.props.data.error ) {
			return <Text>Error</Text> // @todo
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