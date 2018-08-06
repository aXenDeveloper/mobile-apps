import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import Swipeable from 'react-native-swipeable';

import Lang from "../../utils/Lang";
import ForumIcon from '../../atoms/ForumIcon';
import LastPostInfo from '../../ecosystems/LastPostInfo';
import styles from '../../styles';

export default class ForumItem extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		const rightButtons = [
			<TouchableHighlight style={[styles.rightSwipeItem, styles.markSwipeItem]}>
				<Text style={styles.swipeItemText}>Read</Text>
			</TouchableHighlight>
		];

		return (
			<Swipeable rightButtons={rightButtons}>
				<TouchableHighlight onPress={this.props.onPress}>
					<View style={componentStyles.forumItem}>
						<View style={componentStyles.iconAndInfo}>
							<ForumIcon style={componentStyles.forumIcon} unread={this.props.data.unread} />
							<View style={componentStyles.forumInfo}>
								<Text style={componentStyles.forumTitle} numberOfLines={1}>
									{this.props.data.title}
								</Text>
								<Text style={componentStyles.forumMeta}>
									{Lang.pluralize( Lang.get('posts'), this.props.data.posts)}
								</Text>
							</View>
						</View>
						<LastPostInfo style={componentStyles.lastPost} photo={this.props.data.lastPostPhoto} timestamp={this.props.data.lastPostDate} />
					</View>
				</TouchableHighlight>
			</Swipeable>
		);
	}
}

const componentStyles = StyleSheet.create({
	forumItem: {
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 9,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		minHeight: 75
	},
	forumTitle: {
		fontSize: 17,
		color: '#000',
		fontWeight: "600",
		lineHeight: 18,
		marginBottom: 3,
		letterSpacing: -0.2
	},
	iconAndInfo: {
		flexDirection: 'row',
		flex: 1,
		paddingRight: 20
	},
	forumInfo: {
		marginLeft: 9
	},
	forumMeta: {
		fontSize: 15,
		color: '#8F8F8F',
		letterSpacing: -0.2
	}
});