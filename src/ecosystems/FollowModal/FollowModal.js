import React, { Component } from "react";
import { FlatList, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
import CheckList from "../../ecosystems/CheckList";
import Button from "../../atoms/Button";
import styles, { styleVars } from "../../styles";

class FollowModal extends Component {

	getFollowers() {
		const { followData } = this.props;
		const followCountLang = this.props.followCountLang || 'x_follow_this';

		if( !followData.followers.length && followData.anonFollowCount === 0 ){
			return null;
		}

		const followerList = followData.followers;

		// If there's more members than we're showing (or anon members), add a 'and x more' bubble to our list
		if( followerList.length < ( followData.followCount + followData.anonFollowCount ) ){
			followerList.push({
				id: 'andMore',
				count: ( followData.followCount + followData.anonFollowCount ) - followerList.length
			});
		}

		return (
			<View style={componentStyles.followerWrap}>
				<Text style={componentStyles.followerTitle}>{Lang.pluralize( Lang.get( followCountLang ), followData.followers.length + followData.anonFollowCount )}</Text>
				{followerList.length && <FlatList
					style={styles.mtTight}
					horizontal
					data={followData.followers}
					keyExtractor={item => item.id}
					renderItem={({item}) => this.renderFollowUser(item)}
				/>}
			</View>
		)
	}

	renderFollowUser(item) {
		if( item.id == 'andMore' ){
			return (
				<View style={componentStyles.andMoreBubble}>
					<Text style={componentStyles.andMoreText}>
						+{Lang.pluralize(
							Lang.get("x_more"),
							item.count
						)}
					</Text>
				</View>
			);
		}

		return <UserPhoto url={item.photo} size={36} />
	}

	getFollowButtons() {
		if( this.props.followData.isFollowing ){
			return (
				<View style={componentStyles.buttonWrap}>
					<Button type='primary' filled size='large' title='Save Preference' style={styles.mbTight} />;
					<Button type='warning' filled size='large' title='Unfollow' />;
				</View>
			);
		} else {
			return (
				<View style={componentStyles.buttonWrap}>
					<Button type='primary' filled size='large' title='Follow' />;
				</View>
			);
		}
	}

	getChecklist() {
		if( this.props.followData.followOptions.length <= 1 ){
			return null;
		}
		
		const followOptions = this.props.followData.followOptions.map( (item) => ({
			key: item.type,
			title: Lang.get('follow_' + item.type),
			checked: item.selected
		}));

		return <CheckList type='radio' data={followOptions}  />
	}

	render() {
		return (
			<Modal style={componentStyles.modal} swipeDirection='down' onSwipe={this.props.close} isVisible={this.props.isVisible}>
				<View style={componentStyles.modalInner}>				
					{this.getChecklist()}
					<View style={componentStyles.modalBody}>
						{this.getFollowButtons()}
					</View>
				</View>
			</Modal>
		);
	}
}

const componentStyles = StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
		padding: 0
	},
	modalInner: {
		backgroundColor: '#fff',
		borderRadius: 6,
		overflow: 'hidden'
	},
	followerWrap: {
		backgroundColor: '#f5f5f5',
		padding: styleVars.spacing.wide,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.borderColors.medium
	},
	followerTitle: {
		fontSize: styleVars.fontSizes.small,
		color: styleVars.lightText,
	},
	andMore: {
		backgroundColor: "#f0f0f0",
		height: 36,
		borderRadius: 36,
		paddingHorizontal: 15,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	andMoreText: {
		color: "#888",
		fontSize: 13
	},
	modalBody: {
		backgroundColor: '#f5f5f5',
		padding: styleVars.spacing.wide
	},
	buttonWrap: {
		marginTop: -1
	}
});

export default FollowModal;