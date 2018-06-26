import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import ShadowedArea from '../../atoms/ShadowedArea';
import TopicIcon from '../../atoms/TopicIcon';
import LockedIcon from '../../atoms/LockedIcon';
import TopicStatus from '../../atoms/TopicStatus';
import LastPostInfo from '../../ecosystems/LastPostInfo';
import ContentRow from '../../ecosystems/ContentRow';
import stylesheet from '../../styles.js';

export default class TopicRow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ContentRow withSpace unread={this.props.data.unread} onPress={this.props.onPress}>
				<View style={styles.topicRowInner}>
					<View style={styles.topicIconContainer}>
						{( this.props.data.locked ? 
							<LockedIcon style={styles.lockedIcon} />
							: <TopicIcon style={styles.topicIcon} unread={this.props.data.unread} /> )}
					</View>
					<View style={styles.topicInfo}>
						<View style={styles.topicTitle}>
							<Text style={[styles.topicTitleText, this.props.data.unread ? stylesheet.title : stylesheet.titleRead]} numberOfLines={1}>{this.props.data.title}</Text>
						</View>
						<Text style={[styles.topicSnippet, this.props.data.unread ? stylesheet.text : stylesheet.textRead]} numberOfLines={1}>
							{this.props.data.snippet}
						</Text>
						<View style={styles.topicStatuses}>
							{this.props.data.hot ? <TopicStatus style={styles.topicStatusesText} type="hot" /> : null}
							{this.props.data.pinned ? <TopicStatus style={styles.topicStatusesText} type="pinned" /> : null}
							<Text style={[styles.topicStatusesText, styles.topicMetaText]}>{this.props.data.replies} replies</Text>
						</View>
					</View>
					<LastPostInfo style={styles.lastPost} photo={this.props.data.lastPostPhoto} timestamp={this.props.data.lastPostDate} />
				</View>
			</ContentRow>
		);
	}
}

const styles = StyleSheet.create({
	outerTopicRow: {
		//marginBottom: 4
	},
	topicRowInner: {
		paddingLeft: 9,
		paddingRight: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch'
	},
	topicInfo: {
		flex: 1,
		paddingRight: 30
	},
	topicIconContainer: {
		marginRight: 9,
		marginTop: 2,
		alignItems: 'flex-start',
	},
	topicIcon: {
		marginTop: 3,
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
	topicMeta: {
		backgroundColor: '#FAFAFA',
		paddingVertical: 13,
		paddingHorizontal: 16
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
		//marginTop: 8
	},
	topicStatusesText: {
		fontSize: 13,
		color: '#8F8F8F',
		marginRight: 10
	}
});