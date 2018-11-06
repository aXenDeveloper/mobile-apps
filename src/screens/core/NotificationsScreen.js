import React, { Component } from 'react';
import { Text, View, SectionList, Alert, ScrollView } from 'react-native';
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { NotificationRow, NotificationFragment } from "../../ecosystems/Notification";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import SectionHeader from "../../atoms/SectionHeader";
import ErrorBox from "../../atoms/ErrorBox";
import { isSupportedType, isSupportedUrl } from "../../utils/isSupportedType";
import EndOfComments from "../../atoms/EndOfComments";

/* Main query, passed as a HOC */
const NotificationQuery = gql`
	query NotificationQuery($offset: Int) {
		core {
			me {
				id
				notifications(sortBy: unread, sortDir: desc, offset: $offset) {
					...NotificationFragment
				}
			}
		}
	}
	${NotificationFragment}
`;

/* Mutation to mark a notification as read */
const MarkReadMutation  = gql`
	mutation MarkNotificationRead($id: Int!) {
		mutateCore {
			markNotificationRead(id: $id) {
				...NotificationFragment
			}
		}
	}
	${NotificationFragment}
`;

class NotificationsScreen extends Component {
	static navigationOptions = {
		title: 'Notifications',
	};

	constructor(props) {
		super(props);
		this._onPressHandlers = {};
		this.state = {
			reachedEnd: false
		};
	}

	/**
	 * Render a section header, but only if we have subforums to show
	 *
	 * @param 	object 	section 	The section we're rendering
	 * @return 	Component|null
	 */
	renderHeader(section) {
		return <SectionHeader title={section.title} />;
	}

	/**
	 * Handles infinite loading when user scrolls to end
	 *
	 * @return 	void
	 */
	onEndReached = () => {
		if (!this.props.data.loading && !this.state.reachedEnd) {
			this.props.data.fetchMore({
				variables: {
					offset: this.props.data.core.me.notifications.length
				},
				updateQuery: (previousResult, { fetchMoreResult }) => {
					// Don't do anything if there wasn't any new items
					if (!fetchMoreResult || fetchMoreResult.core.me.notifications.length === 0) {
						this.setState({
							reachedEnd: true
						});

						return previousResult;
					}

					const result = Object.assign({}, previousResult, {
						core: {
							...previousResult.core,
							me: {
								...previousResult.core.me,
								notifications: [...previousResult.core.me.notifications, ...fetchMoreResult.core.me.notifications]
							}
						}
					});

					return result;
				}
			});
		}
	};

	/**
	 * Handle refreshing the view
	 *
	 * @return 	void
	 */
	onRefresh = () => {
		this.setState({
			reachedEnd: false
		});

		this.props.data.refetch();
	};

	/**
	 * Return the footer component. Show a spacer by default, but a loading post
	 * if we're fetching more items right now.
	 *
	 * @return 	Component
	 */
	getFooterComponent() {
		// If we're loading more items in
		if (this.props.data.networkStatus == 3 && !this.state.reachedEnd) {
			return <NotificationRow loading={true} />;
		}

		return <EndOfComments label="No more notifications right now" />;
	}

	/**
	 * Build and return the section data, splitting notifications list into read/unread
	 *
	 * @return 	array
	 */
	getSectionData() {
		const sectionData = [];
		const notifications = this.props.data.core.me.notifications;
		const readStart = notifications.findIndex( (notification) => notification.unread === false );
		let unread = [];
		let read = [];

		// Now create two arrays, to hold our unread and read notifications
		if( readStart === 0 ){
			read = notifications;
		} else if ( readStart === -1 ) {
			unread = notifications;
		} else {
			unread = notifications.slice(0, readStart);
			read = notifications.slice(readStart);
		}
		
		if( unread.length ){
			sectionData.push({
				title: "New Notifications",
				data: unread
			});
		}
		if( read.length ){
			sectionData.push({
				title: "Older",
				data: read
			});
		}

		return sectionData;
	}

	/**
	 * Memoization function that returns an onPress handler for a given item
	 *
	 * @param 	object 		Notification object
	 * @return 	function
	 */
	getOnPressHandler(item) {
		if( _.isUndefined( this._onPressHandlers[ item.id ] ) ){
			this._onPressHandlers[ item.id ] = () => this.onPress(item);
		}

		return this._onPressHandlers[ item.id ];
	}
	
	/**
	 * OnPress handler for an individual notification
	 *
	 * @param 	object 		Notification object
	 * @return 	void
	 */
	async onPress(item) {
		try {
			await this.props.client.mutate({
				mutation: MarkReadMutation,
				variables: {
					id: item.id
				}
			});
		} catch (err) {
			// In this case, while the notification won't be marked as read we'll still
			// take the user to the item, so ignore it.
			Alert.alert(
				"Error", 
				err,
				[{ text: Lang.get('ok') }], 
				{ cancelable: false }
			);
			return;
		}

		const isSupported = isSupportedUrl([item.url.app, item.url.module, item.url.controller]);

		if (isSupported) {
			this.props.navigation.navigate(isSupported, {
				id: item.itemID
			});
		} else {
			this.props.navigation.navigate("WebView", {
				url: item.url.full
			});
		}
	}

	render() {
		if (this.props.data.loading ){
			return (
				<PlaceholderRepeater repeat={7}>
					<Text>Loading</Text>
				</PlaceholderRepeater>
			);
		} else if( this.props.data.error ){
			return <ErrorBox message={Lang.get("notifications_error")} />;
		} else {

			const ListEmptyComponent = <ErrorBox message={"You have no notifications"} showIcon={false} />;

			return (
				<ScrollView style={{flex: 1}}>
					<SectionList 
						style={{flex: 1}}
						sections={this.getSectionData()}
						keyExtractor={item => item.id}
						renderSectionHeader={({ section }) => this.renderHeader(section)}
						renderItem={({item}) => <NotificationRow key={item.key} data={item} onPress={this.getOnPressHandler(item)} />} 
						refreshing={this.props.data.networkStatus == 4}
						onRefresh={this.onRefresh}
						onEndReached={this.onEndReached}
						ListEmptyComponent={ListEmptyComponent}
						ListFooterComponent={() => this.getFooterComponent()}
					/>
				</ScrollView>
			);
		}
	}
}

export default compose(
	withApollo,
	graphql(NotificationQuery, {
		options: {
			//fetchPolicy: 'cache-and-network' // Needed here so that we fetch fresh notification data after e.g. reading a topic
		}
	}),
)(NotificationsScreen);