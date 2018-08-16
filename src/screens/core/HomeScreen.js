import React, { Component } from 'react';
import { Text, ScrollView, View, StyleSheet, FlatList } from 'react-native';
import gql from "graphql-tag";
import { graphql, withApollo } from "react-apollo";
import _ from "underscore";
import { connect } from "react-redux";

import { Post } from "../../ecosystems/Post";
import Button from "../../atoms/Button";
import LargeTitle from "../../atoms/LargeTitle";
import StreamCard from "../../ecosystems/StreamCard";
import ContentCard from "../../ecosystems/ContentCard";
import { PlaceholderRepeater } from '../../ecosystems/Placeholder';
import getErrorMessage from "../../utils/getErrorMessage";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import { styleVars } from '../../styles';

import { HomeSections } from '../../ecosystems/HomeSections';

/*
NOTE: In this component we don't use the HOC graphql(), instead manually calling
this.props.client.query on mount. This allows us to build a dynamic query based
on the homepage widgets that have been configured on the site.
*/

const HomeSectionsToShow = ['new_content', 'our_picks'];

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
		}
	}

	async componentDidMount() {

		let queryFragments = [];
		let queryIncludes = [];

		// Dynamically build the fragments we'll need
		HomeSectionsToShow.forEach( (section) => {
			if( !_.isUndefined( HomeSections[ section ] ) ){
				queryFragments.push( '...' + HomeSections[section].fragmentName );
				queryIncludes.push( HomeSections[section].fragment );
			}
		});

		const query = gql`
			query HomeQuery {
				core {
					${queryFragments.join('\n')}
				}
			}
			${gql( queryIncludes.join('\n') )}
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

	render() {
		if( this.state.error ){
			const error = getErrorMessage(this.state.data.error, {});
			return <Text>{error}</Text>;
		} else {
			return (
				<ScrollView style={{ flexGrow: 1 }}>
					{HomeSectionsToShow.map( (section) => {
						const SectionComponent = HomeSections[section].component;
						return <SectionComponent key={section} loading={this.state.loading} data={this.state.data} cardWidth={HomeScreen.CARD_WIDTH} />
					})}
				</ScrollView>
			);
		}
	}
}

export default connect(state => ({
	user: state.user,
	site: state.site
}))( withApollo(HomeScreen) );

const componentStyles = StyleSheet.create({
	browseWrapper: {
		backgroundColor: '#fff',
		padding: styleVars.spacing.wide
	},
	feed: {
		overflow: 'visible'
	}
});