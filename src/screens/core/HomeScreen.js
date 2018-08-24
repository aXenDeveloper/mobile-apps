import React, { Component } from "react";
import {
	Text,
	Image,
	ScrollView,
	View,
	StyleSheet,
	FlatList
} from "react-native";
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import _ from "underscore";
import { connect } from "react-redux";

import Lang from "../../utils/Lang";
import { Post } from "../../ecosystems/Post";
import LargeTitle from "../../atoms/LargeTitle";
import StreamCard from "../../ecosystems/StreamCard";
import LoginRegisterPrompt from "../../ecosystems/LoginRegisterPrompt";
import ContentCard from "../../ecosystems/ContentCard";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import getErrorMessage from "../../utils/getErrorMessage";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import styles, { styleVars } from "../../styles";

import { HomeSections } from "../../ecosystems/HomeSections";

/*
NOTE: In this component we don't use the HOC graphql(), instead manually calling
this.props.client.query on mount. This allows us to build a dynamic query based
on the homepage widgets that have been configured on the site.
*/

const HomeSectionsToShow = ["active_users", "our_picks", "new_content"];

class HomeScreen extends Component {
	static navigationOptions = {
		title: "Invision Community"
	};

	static CARD_WIDTH = 285;

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: false,
			data: null
		};
	}

	async componentDidMount() {
		let queryFragments = [];
		let queryIncludes = [];

		// Dynamically build the fragments we'll need
		HomeSectionsToShow.forEach(section => {
			if (!_.isUndefined(HomeSections[section])) {
				queryFragments.push("..." + HomeSections[section].fragmentName);
				queryIncludes.push(HomeSections[section].fragment);
			}
		});

		const query = gql`
			query HomeQuery {
				core {
					${queryFragments.join("\n")}
				}
			}
			${gql(queryIncludes.join("\n"))}
		`;

		const { data } = await this.props.client.query({
			query,
			variables: {}
		});

		this.setState({
			loading: false,
			data
		});
	}

	/**
	 * Returns the login/register component if a guest
	 *
	 * @return 	Component|null
	 */
	getLoginRegPrompt() {
		if( this.props.auth.authenticated ){
			return null;
		}

		return (
			<LoginRegisterPrompt
				closable
				register={this.props.site.allow_reg !== "DISABLED"}
				registerUrl={this.props.site.allow_reg_target || null}
				navigation={this.props.navigation}
				message={Lang.get( this.props.site.allow_reg !== "DISABLED" ? 'login_register_prompt' : 'login_prompt', {
					siteName: this.props.site.board_name
				})}
			/>
		);
	}

	render() {
		if (this.state.error) {
			const error = getErrorMessage(this.state.data.error, {});
			return <Text>{error}</Text>;
		} else {
			return (
				<React.Fragment>
					{this.getLoginRegPrompt()}
					<ScrollView style={componentStyles.browseWrapper}>
						{HomeSectionsToShow.map(section => {
							const SectionComponent =
								HomeSections[section].component;
							return (
								<React.Fragment key={section}>
									<LargeTitle
										icon={HomeSections[section].icon || null}
									>
										{Lang.get(section)}
									</LargeTitle>
									<SectionComponent
										loading={this.state.loading}
										data={this.state.data}
										cardWidth={HomeScreen.CARD_WIDTH}
										navigation={this.props.navigation}
									/>
								</React.Fragment>
							);
						})}
					</ScrollView>
				</React.Fragment>
			);
		}
	}
}

export default connect(state => ({
	user: state.user,
	site: state.site,
	auth: state.auth
}))(withApollo(HomeScreen));

const componentStyles = StyleSheet.create({});
