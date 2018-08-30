import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

import Lang from '../../utils/Lang';
import { PlaceholderElement, PlaceholderContainer } from '../../ecosystems/Placeholder';
import ShadowedArea from '../../atoms/ShadowedArea';
import TopicIcon from '../../atoms/TopicIcon';
import LockedIcon from '../../atoms/LockedIcon';
import TopicStatus from '../../atoms/TopicStatus';
import LastPostInfo from '../../ecosystems/LastPostInfo';
import ContentRow from '../../ecosystems/ContentRow';
import styles from '../../styles.js';

export default class TopicRow extends Component {	
	constructor(props) {
		super(props);
	}

	loadingComponent() {
		return (
			<ContentRow withSpace>
				<PlaceholderContainer height={48} style={componentStyles.topicRowLoading}>
					<PlaceholderElement width='80%' height={15} top={4}/>
					<PlaceholderElement width='70%' height={12} top={26} />
					<PlaceholderElement circle radius={30} right={0} top={0} />
				</PlaceholderContainer>
				<PlaceholderContainer height={20} style={componentStyles.topicStatusesLoading}>
					<PlaceholderElement width='30%' height={14} />
				</PlaceholderContainer>
			</ContentRow>
		);
	}

	render() {
		if( this.props.loading ){
			return this.loadingComponent();
		}

		// Only show as unread if we're a member and unread flag is true
		const showAsUnread = this.props.isGuest || this.props.data.unread;

		return (
			<ContentRow withSpace unread={showAsUnread} onPress={this.props.onPress}>
				<View style={componentStyles.topicRowInner}>
					<View style={componentStyles.topicInfo}>
						<View style={componentStyles.topicTitle}>
							{!this.props.isGuest && showAsUnread ? <TopicIcon style={componentStyles.topicIcon} unread={this.props.data.unread} /> : null}
							<Text style={[componentStyles.topicTitleText, showAsUnread ? styles.title : styles.titleRead]} numberOfLines={1}>
								{this.props.data.title}
							</Text>
						</View>
						<Text style={[componentStyles.topicSnippet, showAsUnread ? styles.text : styles.textRead]} numberOfLines={1}>
							{this.props.data.snippet}
						</Text>
					</View>
					<LastPostInfo style={componentStyles.lastPost} photo={this.props.data.lastPostPhoto} photoSize={30} timestamp={this.props.data.lastPostDate} />
				</View>
				<View style={componentStyles.topicStatuses}>
					{this.props.data.hot ? <TopicStatus style={componentStyles.topicStatusesText} type="hot" /> : null}
					{this.props.data.pinned ? <TopicStatus style={componentStyles.topicStatusesText} type="pinned" /> : null}
					<Text style={[componentStyles.topicStatusesText, componentStyles.topicMetaText]}>{Lang.pluralize(Lang.get('replies'), this.props.data.replies)}</Text>
				</View>
			</ContentRow>
		);
	}
}

const componentStyles = StyleSheet.create({
	// Loading styles
	topicRowLoading: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingVertical: 10
	},
	topicStatusesLoading: {
		backgroundColor: '#FAFAFA',
		height: 32,
		paddingHorizontal: 15,
		paddingVertical: 8
	},

	// Regular styles
	topicRowInner: {
		paddingLeft: 15,
		paddingRight: 16,
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch'
	},
	topicInfo: {
		flex: 1,
		paddingTop: 4,
		paddingRight: 20
	},
	topicIcon: {
		marginTop: 5,
		marginRight: 4,
		alignSelf: 'flex-start',
	},
	lockedIcon: {
		marginTop: 3,
		alignSelf: 'flex-start',
		width: 12,
		height: 12
	},
	topicTitle: {		
		marginBottom: 2,
		flexDirection: 'row'
	},
	topicTitleText: {
		fontSize: 17,
		fontWeight: "600",
		color: '#000'
	},
	topicSnippet: {
		fontSize: 15,
		color: '#000',
		marginBottom: 4
	},
	topicMetaText: {
		
	},
	lastPost: {
		alignSelf: 'flex-start'
	},
	topicStatuses: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#FAFAFA',
		height: 32,
		paddingHorizontal: 15
	},
	topicStatusesText: {
		fontSize: 13,
		color: '#8F8F8F',
		marginRight: 10
	}
});