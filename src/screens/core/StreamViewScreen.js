import React, { Component } from "react";
import { Text, View, Image, StyleSheet, AsyncStorage, SectionList, FlatList, TouchableOpacity } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";
import Modal from "react-native-modal";
import * as Animatable from 'react-native-animatable';

import Lang from "../../utils/Lang";
import { Post } from "../../ecosystems/Post";
import StreamHeader from "../../atoms/StreamHeader";
import { StreamCard, StreamCardFragment } from "../../ecosystems/Stream";
import CheckList from "../../ecosystems/CheckList";
import CustomHeader from "../../ecosystems/CustomHeader";
import { PlaceholderRepeater, PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import getErrorMessage from "../../utils/getErrorMessage";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import styles from "../../styles";

const StreamViewQuery = gql`
	query StreamViewQuery($id: ID) {
		core {
			stream(id: $id) {
				title
				items {
					...StreamCardFragment
				}
			}
		}
	}
	${StreamCardFragment}
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
			<TouchableOpacity
				onPress={
					!_.isUndefined(navigation.state.params) && !_.isUndefined(navigation.state.params.onPressTitle)
						? navigation.state.params.onPressTitle
						: null
				}
			>
				<View style={headerStyles.row}>
					<Text style={[styles.headerTitle, headerStyles.title]} numberOfLines={1}>
						{!_.isUndefined(navigation.state.params) && !_.isUndefined(navigation.state.params.streamTitle)
							? navigation.state.params.streamTitle
							: ""}
					</Text>
					{!_.isUndefined(navigation.state.params) &&
						!_.isUndefined(navigation.state.params.moreAvailable) &&
						navigation.state.params.moreAvailable && (
							<Image source={require("../../../resources/arrow_down.png")} resizeMode="contain" style={headerStyles.dropdownArrow} />
						)}
				</View>
			</TouchableOpacity>
		)
	});

	getViewRef = ref => this._mainView = ref;

	constructor(props) {
		super(props);
		this._refreshTimeout = null;
		this.state = {
			viewingStream: null,
			results: [],
			loading: true,
			error: null,
			streamListVisible: false
		};
	}

	componentDidMount() {
		this.setNavParams();
	}

	componentWillUnmount() {
		clearTimeout( this._refreshTimeout );
	}

	componentDidUpdate(prevProps, prevState) {
		// If we've changed the stream we're viewing, then we need to update the title
		// and get the results
		if (prevState.viewingStream !== this.state.viewingStream) {
			const activeStream = _.find(this.props.user.streams, stream => stream.id == this.state.viewingStream);

			this.props.navigation.setParams({
				streamTitle: activeStream.title
			});

			this.fetchStream();
		}
	}

	async setNavParams() {
		if (this.props.user.streams.length > 1) {
			this.props.navigation.setParams({
				moreAvailable: true,
				onPressTitle: () => this.showStreamList()
			});

			// Get the user's default
			const defaultStream = await AsyncStorage.getItem("@defaultStream");
			const defaultExists = _.find(this.props.user.streams, stream => stream.id == defaultStream);

			this.setState({
				viewingStream: _.isUndefined(defaultExists) ? "all" : defaultExists,
				offset: 0,
				results: []
			});
		} else {
			this.setState({
				viewingStream: "all",
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

			if (this.state.viewingStream !== "all") {
				variables["id"] = this.state.viewingStream;
			}

			const { data } = await this.props.client.query({
				query: StreamViewQuery,
				variables,
				fetchPolicy: "no-cache"
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

	showStreamList() {
		this.setState({
			streamListVisible: true
		});
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
			past_hour: Lang.get('past_hour'),
			yesterday: Lang.get('yesterday'),
			today: Lang.get('today'),
			last_week: Lang.get('last_week'),
			earlier: Lang.get('earlier')
		};

		return <StreamHeader title={words[section.title]} style={componentStyles.header} />;
	}

	closeStreamModal = () => {
		this.setState({
			streamListVisible: false
		});
	}

	buildStreamList() {
		const data = this.props.user.streams.map( (stream) => ({
			id: stream.id,
			key: stream.id,
			title: stream.title,
			checked: this.state.viewingStream == stream.id
		}));

		return (
			<View style={styles.modalInner}>
				<View style={styles.modalHandle} />
				<View style={styles.modalHeader}>
					<Text style={styles.modalTitle}>{Lang.get('switch_stream')}</Text>
					<TouchableOpacity onPress={this.closeStreamModal}>
						<Image source={require('../../../resources/close_circle.png')} resizeMode='contain' style={styles.modalClose} />
					</TouchableOpacity>
				</View>
				<CheckList data={data} onPress={this.switchStream} />
			</View>
		);
	}

	switchStream = (item) => {
		this.setState({
			streamListVisible: false
		});

		if( this.state.viewingStream == item.id ){
			return;
		}
		
		this._mainView.fadeOut(400);

		this._refreshTimeout = setTimeout( () => {
			this.setState({
				viewingStream: item.id,
				results: [],
				offset: 0
			});
		}, 450 );
	}

	renderStreamListItem(item) {
		console.log( item );
		return <Text>{item.title}</Text>;
	}

	render() {
		if (this.state.loading) {
			return (
				<React.Fragment>
					<PlaceholderContainer height={40}>
						<PlaceholderElement width={100} height={30} top={7} left={7} />
					</PlaceholderContainer>
					<PlaceholderRepeater repeat={4} style={{ marginTop: 7 }}>
						<Post loading={true} />
					</PlaceholderRepeater>
				</React.Fragment>
			);
		} else if (this.state.error) {
			const error = getErrorMessage(this.state.error, {});
			return <Text>{error}</Text>;
		} else {
			const sectionData = this.buildSectionData();

			return (
				<React.Fragment>
					<Modal style={componentStyles.modal} swipeDirection="down" onSwipe={this.closeStreamModal} isVisible={this.state.streamListVisible}>
						{this.buildStreamList()}
					</Modal>
					<Animatable.View style={{ flexGrow: 1 }} ref={this.getViewRef}>
						<View style={componentStyles.timeline} />
						<SectionList
							style={componentStyles.feed}
							sections={sectionData}
							keyExtractor={item => item.indexID}
							renderItem={({ item }) => this.renderItem(item)}
							renderSectionHeader={({ section }) => this.renderHeader(section)}
							stickySectionHeadersEnabled={true}
						/>
					</Animatable.View>
				</React.Fragment>
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
	modal: {
		justifyContent: "flex-end",
		margin: 0,
		padding: 0
	}
});
