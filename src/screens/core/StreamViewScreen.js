import React, { Component } from "react";
import { Text, View, Image, StyleSheet, AsyncStorage, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import { Post } from "../../ecosystems/Post";
import StreamHeader from "../../atoms/StreamHeader";
import StreamCard from "../../ecosystems/StreamCard";
import CustomHeader from "../../ecosystems/CustomHeader";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import getErrorMessage from "../../utils/getErrorMessage";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import styles from "../../styles";

const StreamViewQuery = gql`
	query StreamViewQuery($id: ID) {
		core {
			stream(id: $id) {
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

const headerStyles = StyleSheet.create({
	row: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	dropdownArrow: {
		width: 13,
		height: 13,
		tintColor: "#fff",
		marginLeft: 5
	}
});

class StreamViewScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			<View style={headerStyles.row}>
				<Text style={[styles.headerTitle, headerStyles.title]} numberOfLines={1}>
					{!_.isUndefined( navigation.state.params ) && !_.isUndefined( navigation.state.params.streamTitle ) ? navigation.state.params.streamTitle : "Stream"}
				</Text>
				{!_.isUndefined( navigation.state.params ) && !_.isUndefined( navigation.state.params.moreAvailable ) && navigation.state.params.moreAvailable && (
					<Image source={require("../../../resources/arrow_down.png")} resizeMode="contain" style={headerStyles.dropdownArrow} />
				)}
			</View>
		)
	});

	constructor(props) {
		super(props);
		this.state = {
			viewingStream: null,
			results: [],
			loading: true,
			error: null
		};
	}

	componentDidMount() {
		this.setNavParams();
	}

	componentDidUpdate(prevProps, prevState) {
		// If we've changed the stream we're viewing, then we need to update the title
		// and get the results
		if( prevState.viewingStream !== this.state.viewingStream ){
			const activeStream = _.find( this.props.user.streams, (stream) => stream.id == this.state.viewingStream );
			
			this.props.navigation.setParams({
				streamTitle: activeStream.title
			});

			this.fetchStream();
		}
	}

	async setNavParams() {
		if( this.props.user.streams.length ){
			this.props.navigation.setParams({
				moreAvailable: true
			});

			// Get the user's default
			const defaultStream = await AsyncStorage.getItem('@defaultStream');
			const defaultExists = _.find( this.props.user.streams, (stream) => stream.id == defaultStream );

			this.setState({
				viewingStream: _.isUndefined( defaultExists ) ? 'all' : defaultExists,
				offset: 0,
				results: []
			});
		} else {
			this.setState({
				viewingStream: 'all',
				offset: 0,
				results: []
			});
		}
	}

	async fetchStream() {
		this.setState({
			loading: true
		});

		try {
			const variables = {
				offset: this.state.offset
			};

			if( this.state.viewingStream !== 'all' ){
				variables['id'] = this.state.viewingStream;
			}

			const { data } = await this.props.client.query({
				query: StreamViewQuery,
				variables
			});	

			const results = [...this.state.results, ...data.core.stream.items];

			this.setState({
				results,
				offset: results.length,
				loading: false
			});
		} catch (err) {
			console.log(err);
			this.setState({
				error: true,
				loading: false
			});
		}
	}

	/**
	 * Build the section data we need for SectionList
	 * Each stream item has a 'relative time' string. Loop each item, and create sections
	 * based on that string.
	 *
	 * @param 	object 	item 		A raw item object from GraphQL
	 * @param 	object 	streamData 	The stream data
	 * @return 	object
	 */
	buildSectionData() {
		const sections = {};

		if (!this.state.results.length) {
			return [];
		}

		this.state.results.forEach(item => {
			if (_.isUndefined(sections[item.relativeTimeKey])) {
				sections[item.relativeTimeKey] = {
					title: item.relativeTimeKey,
					data: []
				};
			}

			sections[item.relativeTimeKey].data.push(item);
		});

		return Object.values(sections);
	}

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
		const isSupported = isSupportedUrl([item.url.app, item.url.module, item.url.controller]);

		if (isSupported) {
			onPress = () =>
				this.props.navigation.navigate(isSupported, {
					id: item.itemID
				});
		} else {
			onPress = () =>
				this.props.navigation.navigate("WebView", {
					url: item.url.full
				});
		}

		return <StreamCard data={item} isSupported={!!isSupported} onPress={onPress} />;
	}

	/**
	 * Render a stream section
	 *
	 * @param 	object 	section 	Section data
	 * @return 	Component
	 */
	renderHeader(section) {
		const words = {
			past_hour: "Past Hour",
			yesterday: "Yesterday",
			today: "Today",
			last_week: "Past Week",
			earlier: "Earlier"
		};

		return <StreamHeader title={words[section.title]} style={componentStyles.header} />;
	}

	render() {
		if (this.state.loading) {
			return (
				<PlaceholderRepeater repeat={4}>
					<Post loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.state.error) {
			const error = getErrorMessage(this.state.error, {});
			return <Text>{error}</Text>;
		} else {
			const sectionData = this.buildSectionData();

			return (
				<View style={{ flexGrow: 1 }}>
					<View style={componentStyles.timeline} />
					<SectionList
						style={componentStyles.feed}
						sections={sectionData}
						keyExtractor={item => item.indexID}
						renderItem={({ item }) => this.renderItem(item)}
						renderSectionHeader={({ section }) => this.renderHeader(section)}
						stickySectionHeadersEnabled={false}
					/>
				</View>
			);
		}
	}
}

export default compose(
	connect(state => ({
		user: state.user
	})),
	withApollo
)(StreamViewScreen);

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
