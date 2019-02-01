import React, { Component } from "react";
import { Text, View, FlatList, ScrollView, SectionList } from "react-native";
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import Lang from "../../utils/Lang";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import NotificationSettingRow from "../../atoms/NotificationSettingRow";
import SectionHeader from "../../atoms/SectionHeader";
import ErrorBox from "../../atoms/ErrorBox";

/* Main query, passed as a HOC */
const NotificationQuery = gql`
	query NotificationTypeQuery {
		core {
			notificationTypes {
				id
				name
				group
				lang
				inline {
					disabled
					default
					value
				}		
			}
		}
	}
`;

class NotificationsSettingsScreen extends Component {
	static navigationOptions = {
		title: "Notification Settings"
	};

	getNotificationSections() {
		const sections = {};
		const types = this.props.data.core.notificationTypes;


		types.forEach( type => {
			if( _.isUndefined( sections[ type.group ] ) ){
				sections[ type.group ] = {
					title: type.group,
					data: []
				};
			}

			const langKey = `notifications__${type.id}`;

			sections[ type.group ].data.push({
				key: type.id,
				title: Lang.get(langKey) !== langKey ? Lang.get(langKey) : type.lang,
				on: type.inline.value,
				enabled: !type.inline.disabled
			});
		});
		
		return Object.values(sections);
	}

	render() {

		if (this.props.data.loading) {
			return (
				<PlaceholderRepeater repeat={7}>
					<NotificationSettingRow loading />
				</PlaceholderRepeater>
			);
		} else if (this.props.data.error) {
			return <ErrorBox message={Lang.get("notifications_error")} />;
		} else {
			const ListEmptyComponent = <ErrorBox message={Lang.get("notifications_error")} />;

			return (
				<View style={{ flex: 1 }}>
					<SectionList 
						sections={this.getNotificationSections()}
						renderItem={({item}) => <NotificationSettingRow data={item} />}
						renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
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
	withApollo,
	graphql(NotificationQuery)
)(NotificationsSettingsScreen);

