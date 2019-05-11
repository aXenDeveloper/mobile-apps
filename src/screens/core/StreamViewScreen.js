import React, { Component } from "react";
import { Text, View, Image, StyleSheet, AsyncStorage, SectionList, FlatList, TouchableOpacity } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";

import Lang from "../../utils/Lang";
import { Post } from "../../ecosystems/Post";
import GoToMulti from "../../atoms/GoToMulti";
import StreamHeader from "../../atoms/StreamHeader";
import { StreamCard, StreamCardFragment } from "../../ecosystems/Stream";
import CheckList from "../../ecosystems/CheckList";
import CustomHeader from "../../ecosystems/CustomHeader";
import { PlaceholderRepeater, PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import getErrorMessage from "../../utils/getErrorMessage";
import styles from "../../styles";

const StreamViewQuery = gql`
	query StreamViewQuery($id: ID, $offset: Int, $limit: Int) {
		core {
			stream(id: $id) {
				title
				items(offset: $offset, limit: $limit) {
					...StreamCardFragment
				}
			}
		}
	}
	${StreamCardFragment}
`;

const LIMIT = 25;

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
		headerLeft: <GoToMulti />,
		headerTitle: (
			<TouchableOpacity
				onPress={!_.isUndefined(navigation.state.params) && !_.isUndefined(navigation.state.params.onPressTitle) ? navigation.state.params.onPressTitle : null}
			>
				<View style={headerStyles.row}>
					<Text style={[styles.headerTitle, headerStyles.title]} numberOfLines={1}>
						{!_.isUndefined(navigation.state.params) && !_.isUndefined(navigation.state.params.streamTitle) ? navigation.state.params.streamTitle : ""}
					</Text>
					{!_.isUndefined(navigation.state.params) && !_.isUndefined(navigation.state.params.moreAvailable) && navigation.state.params.moreAvailable && (
						<Image source={require("../../../resources/arrow_down.png")} resizeMode="contain" style={headerStyles.dropdownArrow} />
					)}
				</View>
			</TouchableOpacity>
		)
	});

	sectionTitles = {
		past_hour: Lang.get("past_hour"),
		yesterday: Lang.get("yesterday"),
		today: Lang.get("today"),
		last_week: Lang.get("last_week"),
		earlier: Lang.get("earlier")
	};

	getViewRef = ref => (this._mainView = ref);

	constructor(props) {
		super(props);
		this._refreshTimeout = null;
		this._list = null;
		this._mainView = null;
		this.state = {
			viewingStream: null, // Currently active stream
			results: [], // Simple array of results from GraphQL
			sectionData: [], // The formatted sections resdy for Sectionlist
			loading: false, // Are we loading data?
			error: null, // Was there an error?
			streamListVisible: false, // Is the stream list modal visible?
			reachedEnd: false, // Have we reached the end of the results list?
			offset: 0 // What offset are we loading from?
		};
	}

	componentDidMount() {
		this.setNavParams();
	}

	componentWillUnmount() {
		clearTimeout(this._refreshTimeout);
	}

	/**
	 * DidUpdate, check whether the active stream has changed
	 *
	 * @return 	void
	 */
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

	/**
	 * Called when component mounted, sets the nav params to show the
	 * current stream, and let the user tap to see the stream list
	 *
	 * @return 	void
	 */
	async setNavParams() {
		if (this.props.user.streams.length > 1) {
			this.props.navigation.setParams({
				moreAvailable: true,
				onPressTitle: () => this.showStreamModal()
			});

			// Get the user's default
			const defaultStream = await AsyncStorage.getItem("@defaultStream");
			const defaultExists = _.find(this.props.user.streams, stream => stream.id == defaultStream);

			this.setState({
				viewingStream: _.isUndefined(defaultExists) ? "all" : defaultExists,
				offset: 0,
				sectionData: []
			});
		} else {
			this.setState({
				viewingStream: "all",
				offset: 0,
				sectionData: []
			});
		}
	}

	/**
	 * Load new stream results into the component
	 *
	 * @return 	void
	 */
	async fetchStream() {
		if (this.state.loading || this.state.reachedEnd) {
			return;
		}

		this.setState({
			loading: true
		});

		try {
			const variables = {
				offset: this.state.offset,
				limit: LIMIT
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
			const sectionData = this.buildSectionData(results);

			this.setState({
				results,
				sectionData,
				reachedEnd: !data.core.stream.items.length || data.core.stream.items.length < LIMIT,
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
	 * Toggle the stream modal
	 *
	 * @return 	void
	 */
	showStreamModal = () => {
		this.setState({
			streamListVisible: true
		});
	};

	/**
	 * Hide the stream modal
	 *
	 * @return 	void
	 */
	closeStreamModal = () => {
		this.setState({
			streamListVisible: false
		});
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
	buildSectionData(items) {
		const sections = {};

		if (!items.length) {
			return [];
		}

		items.forEach(item => {
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
	 * Build the list of streams the user can choose from
	 *
	 * @return 	Component
	 */
	buildStreamList() {
		const data = this.props.user.streams.map(stream => ({
			id: stream.id,
			key: stream.id,
			title: stream.title,
			checked: this.state.viewingStream == stream.id
		}));

		return (
			<View style={styles.modalInner}>
				<View style={styles.modalHandle} />
				<View style={styles.modalHeader}>
					<Text style={styles.modalTitle}>{Lang.get("switch_stream")}</Text>
					<TouchableOpacity onPress={this.closeStreamModal}>
						<Image source={require("../../../resources/close_circle.png")} resizeMode="contain" style={styles.modalClose} />
					</TouchableOpacity>
				</View>
				<CheckList data={data} onPress={this.switchStream} />
			</View>
		);
	}

	/**
	 * Event handler to handle toggling a different stream
	 *
	 * @return 	void
	 */
	switchStream = item => {
		this.setState({
			streamListVisible: false
		});

		if (this.state.viewingStream == item.id) {
			return;
		}

		// To make this transition a bit nicer, fade out the existing results,
		// then after a timeout do our state change to init loading new results while we
		// fade back in (placeholders will be showing at that point)

		this._mainView.fadeOut(400);

		this._refreshTimeout = setTimeout(() => {
			this.setState(
				{
					viewingStream: item.id,
					sectionData: [],
					results: [],
					offset: 0,
					reachedEnd: false
				},
				() => {
					this._mainView.fadeIn(100);
				}
			);
		}, 450);
	};

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached = () => {
		if (!this.state.loading && !this.state.reachedEnd) {
			this.fetchStream();
		}
	};

	/**
	 * Returns placeholder components if our state indicates we need them
	 *
	 * @return 	Component|null
	 */
	getFooterComponent = () => {
		if (this.state.loading && !this.state.reachedEnd) {
			return this.getPlaceholder();
		}

		return null;
	};

	/**
	 * Build placeholder components
	 *
	 * @return 	Component
	 */
	getPlaceholder() {
		return (
			<React.Fragment>
				{this.state.offset == 0 && (
					<PlaceholderContainer height={40}>
						<PlaceholderElement width={100} height={30} top={7} left={7} />
					</PlaceholderContainer>
				)}
				<PlaceholderRepeater repeat={this.state.offset > 0 ? 1 : 4} style={{ marginTop: 7 }}>
					<Post loading={true} />
				</PlaceholderRepeater>
			</React.Fragment>
		);
	}

	render() {
		if (this.state.loading && this.state.sectionData === []) {
			return this.getPlaceholder();
		} else if (this.state.error) {
			const error = getErrorMessage(this.state.error, {});
			return <Text>{error}</Text>;
		} else {
			return (
				<React.Fragment>
					<Modal style={componentStyles.modal} swipeDirection="down" onSwipeComplete={this.closeStreamModal} isVisible={this.state.streamListVisible}>
						{this.buildStreamList()}
					</Modal>
					<Animatable.View style={{ flexGrow: 1 }} ref={this.getViewRef}>
						<View style={componentStyles.timeline} />
						<SectionList
							style={componentStyles.feed}
							sections={this.state.sectionData}
							ref={list => (this._list = list)}
							keyExtractor={item => item.indexID}
							renderItem={({ item }) => <StreamCard data={item} />}
							renderSectionHeader={({ section }) => <StreamHeader title={this.sectionTitles[section.title]} style={componentStyles.header} />}
							stickySectionHeadersEnabled={true}
							onEndReached={this.onEndReached}
							ListFooterComponent={this.getFooterComponent}
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
