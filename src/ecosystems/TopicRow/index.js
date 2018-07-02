import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
/*import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import { Svg } from 'expo';*/

import { PlaceholderElement, PlaceholderContainer } from '../../atoms/Placeholder';
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

	loadingComponent() {
		return (
			<ContentRow withSpace>
				<PlaceholderContainer height={45} style={styles.topicRowLoading}>
					<PlaceholderElement width='80%' height={20} top={0}/>
					<PlaceholderElement width='70%' height={15} top={27} />
					<PlaceholderElement circle radius={40} right={0} top={0} />
				</PlaceholderContainer>
				<PlaceholderContainer height={20} style={styles.topicStatusesLoading}>
					<PlaceholderElement width='30%' height={15} />
				</PlaceholderContainer>
			</ContentRow>
		);
	}

	render() {
		if( this.props.loading ){
			return this.loadingComponent();
		}

		return (
			<ContentRow withSpace unread={this.props.data.unread} onPress={this.props.onPress}>
				<View style={styles.topicRowInner}>
					<View style={styles.topicInfo}>
						<View style={styles.topicTitle}>
							{this.props.data.unread ? <TopicIcon style={styles.topicIcon} unread={this.props.data.unread} /> : null}
							<Text style={[styles.topicTitleText, this.props.data.unread ? stylesheet.title : stylesheet.titleRead]} numberOfLines={1}>
								{this.props.data.title}
							</Text>
						</View>
						<Text style={[styles.topicSnippet, this.props.data.unread ? stylesheet.text : stylesheet.textRead]} numberOfLines={1}>
							{this.props.data.snippet}
						</Text>
					</View>
					<LastPostInfo style={styles.lastPost} photo={this.props.data.lastPostPhoto} photoSize={30} timestamp={this.props.data.lastPostDate} />
				</View>
				<View style={styles.topicStatuses}>
					{this.props.data.hot ? <TopicStatus style={styles.topicStatusesText} type="hot" /> : null}
					{this.props.data.pinned ? <TopicStatus style={styles.topicStatusesText} type="pinned" /> : null}
					<Text style={[styles.topicStatusesText, styles.topicMetaText]}>{this.props.data.replies} replies</Text>
				</View>
			</ContentRow>
		);
	}
}

const styles = StyleSheet.create({
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