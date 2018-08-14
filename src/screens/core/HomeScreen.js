import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, FlatList } from 'react-native';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import _ from "underscore";
import { connect } from "react-redux";

import { Post } from "../../ecosystems/Post";
import LargeTitle from "../../atoms/LargeTitle";
import StreamCard from "../../ecosystems/StreamCard";
import { PlaceholderRepeater } from '../../atoms/Placeholder';
import getErrorMessage from "../../utils/getErrorMessage";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";

const HomeQuery = gql`
	query StreamViewQuery($streamID: ID!) {
		core {
			stream(id: $streamID) {
				title
				items {
					indexID
					itemID
					url {
						full
						app
						module
						controller
					}
					containerID
					containerTitle
					class
					content
					contentImages
					title
					hidden
					updated
					created
					isComment
					isReview
					relativeTimeKey
					itemAuthor {
						id
						name
						photo
					}
					author {
						id
						name
						photo
					}
				}
			}
		}
	}
`;

class HomeScreen extends Component {
	static navigationOptions = {
		title: "Community"
	};

	/**
	 * Build the section data we need for SectionList
	 * Each stream item has a 'relative time' string. Loop each item, and create sections
	 * based on that string.
	 *
	 * @param 	object 	item 		A raw item object from GraphQL
	 * @param 	object 	streamData 	The stream data
	 * @return 	object
	 */
	/*buildListData(items, streamData) {
		const data = {};

		if( !items.length ){
			return [];
		}

		items.forEach(item => {
			if( _.isUndefined( sections[ item.relativeTimeKey ] ) ){
				sections[ item.relativeTimeKey ] = {
					title: item.relativeTimeKey,
					data: []
				};
			}

			sections[ item.relativeTimeKey ].data.push(item);
		});

		return Object.values(sections);
	}*/

	/**
	 * Render an individual stream item
	 * We also build an onPress handler here, based on whether we are able to view the content
	 * inside the app. If not, we navigate to our webview screen.
	 *
	 * @param 	object 	item 	Item data
	 * @return 	Component
	 */
	renderItem(item) {
		let onPress;
		const isSupported = isSupportedUrl([ item.url.app, item.url.module, item.url.controller ]);

		if( isSupported ){
			onPress = () => this.props.navigation.navigate( isSupported, {
				id: item.itemID
			});
		} else {
			onPress = () => this.props.navigation.navigate("WebView", {
				url: item.url.full
			});
		}

		return <StreamCard data={item} isSupported={!!isSupported} onPress={onPress} />
	}

	render() {
		if (this.props.data.loading && this.props.data.networkStatus !== 3 && this.props.data.networkStatus !== 4) {
			return (
				<PlaceholderRepeater repeat={4}>
					<Post loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, {});
			return <Text>{error}</Text>;
		} else {
			const streamData = this.props.data.core.stream;
			//const listData = this.buildListData(streamData.items, streamData);

			return (
				<View style={{ flexGrow: 1 }}>
					<LargeTitle>New For You</LargeTitle>
					<FlatList
						horizontal
						style={componentStyles.feed}
						data={streamData.items}
						keyExtractor={item => item.indexID}
						renderItem={({item}) => this.renderItem(item)}
					/>
				</View>
			);
		}
	}
}

export default connect(state => ({
	user: state.user,
	site: state.site
}))( graphql(HomeQuery, {
	options: props => ({
		notifyOnNetworkStatusChange: true,
		variables: {
			streamID: props.user.isGuest ? null : 1
		}
	}),
})( HomeScreen ));

const componentStyles = StyleSheet.create({
	header: {
		//marginLeft: -25
	},
	timeline: { 
		/*backgroundColor: '#888', 
		width: 2, 
		position: 'absolute', 
		top: 15, 
		left: 13, 
		bottom: 0 */
	},
	feed: {
		//marginHorizontal: 9
		/*paddingLeft: 30,
		marginRight: 9*/
	}
});