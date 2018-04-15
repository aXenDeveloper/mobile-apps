import React, { Component } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
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

	actionSheetPress(i) {
		console.log('action sheet');
	}

	actionSheetOptions() {
		return ([
			'Cancel',
			'Share',
			'Report'
		]);
	}

	actionSheetCancelIndex() {
		return 0;
	}

	reactionOnPress(reactionID) {
		if( this.props.data.reputation.canViewReps ){
			console.log('press reaction');
		}
	}

	render() {
		//console.log( reactions );

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
						<PostControl>Quote</PostControl>
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