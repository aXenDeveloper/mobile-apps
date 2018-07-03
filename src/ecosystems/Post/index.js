import React, { Component } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

import { PlaceholderElement, PlaceholderContainer } from '../../atoms/Placeholder';
import ShadowedArea from '../../atoms/ShadowedArea';
import UserPhoto from '../../atoms/UserPhoto';
import PostControls from '../../atoms/PostControls';
import PostControl from '../../atoms/PostControl';
import RichTextContent from '../../atoms/RichTextContent';
import Reaction from '../../atoms/Reaction';
import relativeTime from '../../utils/RelativeTime';
import ActionSheet from 'react-native-actionsheet';

export default class Post extends Component {	
	constructor(props) {
		super(props);
	}

	//====================================================================
	// LOADING
	loadingComponent() {
		return (
			<ShadowedArea style={[ styles.post, styles.postWrapper ]}>
				<PlaceholderContainer height={40}>
					<PlaceholderElement circle radius={40} left={0} top={0} />
					<PlaceholderElement width={160} height={15} top={0} left={50} />
					<PlaceholderElement width={70} height={14} top={23} left={50} />
				</PlaceholderContainer>
				<PlaceholderContainer height={100} style={styles.postContentContainer}>
					<PlaceholderElement width='100%' height={12} />
					<PlaceholderElement width='70%' height={12} top={20} />
					<PlaceholderElement width='82%' height={12} top={40} />
					<PlaceholderElement width='97%' height={12} top={60} />
				</PlaceholderContainer>
			</ShadowedArea>
		);
	}


	//====================================================================
	// ACTION SHEET CONFIG

	/**
	 * Handle tapping an action sheet item
	 *
	 * @return 	void
	 */
	actionSheetPress(i) {
		console.log('action sheet');
	}
	/**
	 * Return the options to be shown in the action sheet
	 *
	 * @return 	array
	 */
	actionSheetOptions() {
		return ([
			'Cancel',
			'Share',
			'Report'
		]);
	}
	/**
	 * Return the index of the 'cancel' option
	 *
	 * @return 	number
	 */
	actionSheetCancelIndex() {
		return 0;
	}
	//====================================================================

	/**
	 * Handle tapping a reaction count
	 *
	 * @return 	number
	 */
	reactionOnPress(reactionID) {
		if( this.props.data.reputation.canViewReps ){
			console.log('press reaction');
		}
	}

	render() {
		if( this.props.loading ){
			return this.loadingComponent();
		}

		return (
			<TouchableHighlight style={styles.postWrapper}>
				<ShadowedArea style={styles.post}>
					<View style={styles.postHeader}>
						<TouchableOpacity style={styles.postInfo} onPress={this.props.profileHandler}>
							<View style={styles.postInfo}>
								<UserPhoto url={this.props.data.author.photo} size={36} />
								<View style={styles.meta}>
									<Text style={styles.username}>{this.props.data.author.name}</Text>
									<Text style={styles.date}>{relativeTime.long(this.props.data.timestamp)}</Text>
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={styles.postInfoButton} onPress={() => this._actionSheet.show()}>
							<Image style={styles.postMenu} resizeMode='contain' source={require('../../../resources/dots.png')} />
						</TouchableOpacity>
					</View>
					<View style={styles.postContentContainer}>
						<RichTextContent>{this.props.data.content}</RichTextContent>
						{this.props.data.reactions.length ? 
							<View style={styles.postReactionList}>
								{this.props.data.reactions.map( (reaction) => {
									return (<Reaction style={styles.reactionItem} key={reaction.id} id={reaction.id} image={reaction.image} count={reaction.count} onPress={() => this.reactionOnPress(reaction.id)} />);
								})}
							</View>
							: null
						}
					</View>
					<PostControls>
						{this.props.data.canReply ? <PostControl onPress={this.props.onPressReply}>Quote</PostControl> : null}
						<PostControl>Like</PostControl>
					</PostControls>
					<ActionSheet 
						ref={(o) => this._actionSheet = o} 
						title='Post options' 
						options={this.actionSheetOptions()} 
						cancelButtonIndex={this.actionSheetCancelIndex()}
						onPress={this.actionSheetPress} 
					/>
				</ShadowedArea>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	postWrapper: {
		marginBottom: 7
	},
	post: {
		padding: 16,
		paddingBottom: 0
	},
	postHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	postInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		flex: 1
	},
	meta: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		marginLeft: 9
	},
	username: {
		fontSize: 17,
		fontWeight: "600",
		color: '#171717',
	},
	date: {
		fontSize: 14,
		color: '#8F8F8F'
	},
	postContentContainer: {
		marginTop: 16
	},
	postContent: {
		fontSize: 16
	},
	postMenu: {
		width: 24,
		height: 24
	},
	postInfoButton: {
		alignSelf: 'flex-start',
	},
	postReactionList: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginTop: 15
	},
	reactionItem: {
		marginLeft: 10
	}
});