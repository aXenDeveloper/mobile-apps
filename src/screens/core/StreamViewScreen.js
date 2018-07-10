import React, { Component } from 'react';
import { Text, View, StyleSheet, SectionList } from 'react-native';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import _ from "underscore";

import Post from "../../ecosystems/Post";
import StreamHeader from "../../atoms/StreamHeader";
import StreamCard from "../../ecosystems/StreamCard";
import { PlaceholderRepeater } from '../../atoms/Placeholder';
import getErrorMessage from "../../utils/getErrorMessage";
import isSupportedType from "../../utils/isSupportedType";

const StreamViewQuery = gql`
	query StreamViewQuery {
		core {
			stream {
				title
				items {
					indexID
					itemID
					itemUrl
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


class StreamViewScreen extends Component {
	static navigationOptions = {
		headerTitle: "Stream"
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
	buildSectionData(items, streamData) {
		const sections = {};

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

			sections[ item.relativeTimeKey ].data.push({
				...item,
				isSupported: isSupportedType(item.class)
			});
		});

		return Object.values(sections);
	}

	renderItem(item) {
		return <StreamCard data={item} />
	}

	renderHeader(section) {
		const words = {
			'past_hour': 'Past Hour',
			'yesterday': 'Yesterday',
			'today': 'Today',
			'last_week': 'Past Week',
			'earlier': 'Earlier'
		};

		return <StreamHeader title={words[ section.title ]} style={componentStyles.header} />
	}
	
	render() {
		if (this.props.data.loading && this.props.data.networkStatus !== 3 && this.props.data.networkStatus !== 4) {
			return (
				<PlaceholderRepeater repeat={4}>
					<Post loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			const error = getErrorMessage(this.props.data.error, TopicViewScreen.errors);
			return <Text>{error}</Text>;
		} else {
			const streamData = this.props.data.core.stream;
			const sectionData = this.buildSectionData(streamData.items, streamData);

			//return (<Text>Stream View</Text>);
			return (
				<View style={{ flexGrow: 1 }}>
					<View style={componentStyles.timeline}></View>
					<SectionList
						style={componentStyles.feed}
						sections={sectionData}
						keyExtractor={item => item.indexID}
						renderItem={({item}) => this.renderItem(item)}
						renderSectionHeader={({section}) => this.renderHeader(section)}
						stickySectionHeadersEnabled={false}
					/>
				</View>
			);
		}
	}
}

export default graphql(StreamViewQuery, {
	options: props => ({
		notifyOnNetworkStatusChange: true
	})
})(StreamViewScreen);

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
