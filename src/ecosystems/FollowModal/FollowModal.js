import React, { Component } from "react";
import { FlatList, SectionList, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
import CheckList from "../../ecosystems/CheckList";
import Button from "../../atoms/Button";
import SectionHeader from "../../atoms/SectionHeader";
import ToggleRow from "../../atoms/ToggleRow";
import styles, { styleVars } from "../../styles";

class FollowModal extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			selectedFollowOption: null
		};
	}

	/**
	 * Set our initial state
	 *
	 * @return 	void
	 */
	componentDidMount() {
		const selectedItem = this.props.followData.followOptions.find(item => item.selected);
		const isAnonymous = this.props.followData.followType === "ANONYMOUS";

		this.setState({
			selectedFollowOption: selectedItem ? selectedItem.type : null,
			isAnonymous
		});
	}

	/*getFollowers() {
		const { followData } = this.props;
		const followCountLang = this.props.followCountLang || "x_follow_this";

		if (!followData.followers.length && followData.anonFollowCount === 0) {
			return null;
		}

		const followerList = followData.followers;

		// If there's more members than we're showing (or anon members), add a 'and x more' bubble to our list
		if (followerList.length < followData.followCount + followData.anonFollowCount) {
			followerList.push({
				id: "andMore",
				count: followData.followCount + followData.anonFollowCount - followerList.length
			});
		}

		return (
			<View style={componentStyles.followerWrap}>
				<Text style={componentStyles.followerTitle}>
					{Lang.pluralize(Lang.get(followCountLang), followData.followers.length + followData.anonFollowCount)}
				</Text>
				{followerList.length && (
					<FlatList
						style={styles.mtTight}
						horizontal
						data={followData.followers}
						keyExtractor={item => item.id}
						renderItem={({ item }) => this.renderFollowUser(item)}
					/>
				)}
			</View>
		);
	}

	renderFollowUser(item) {
		if (item.id == "andMore") {
			return (
				<View style={componentStyles.andMoreBubble}>
					<Text style={componentStyles.andMoreText}>+{Lang.pluralize(Lang.get("x_more"), item.count)}</Text>
				</View>
			);
		}

		return <UserPhoto url={item.photo} size={36} />;
	}*/

	/**
	 * Return the buttons that will show in the follow modal
	 *
	 * @return 	Component
	 */
	getFollowButtons() {
		if (this.props.followData.isFollowing) {
			return (
				<View style={componentStyles.buttonWrap}>
					<Button type="primary" filled size="large" title={Lang.get("follow_save")} style={styles.mbTight} onPress={() => this._follow()} />;
					<Button type="warning" filled size="large" title={Lang.get("unfollow")} onPress={this.props.onUnfollow} />;
				</View>
			);
		} else {
			return (
				<View style={componentStyles.buttonWrap}>
					<Button type="primary" filled size="large" title={Lang.get("follow")} onPress={() => this._follow()} />;
				</View>
			);
		}
	}

	/**
	 * onPress handler for Follow or Save button which in turn calls 
	 * the handler passed down to us, with the selected options
	 *
	 * @return 	void
	 */
	_follow() {
		const data = {
			option: this.state.selectedFollowOption,
			anonymous: this.state.isAnonymous
		};

		this.props.onFollow(data);
	}

	/**
	 * Return the CheckList component with the follow options the user can select
	 *
	 * @return 	Component
	 */
	getChecklist() {
		if (this.props.followData.followOptions.length <= 1) {
			return null;
		}

		const followOptions = this.props.followData.followOptions.map(item => ({
			key: item.type,
			title: Lang.get("follow_" + item.type),
			checked: this.state.selectedFollowOption === item.type
		}));

		return <CheckList type="radio" data={followOptions} onPress={this.toggleNotificationOption.bind(this)} />;
	}

	/**
	 * Returns the structure we'll pass into SectionList
	 *
	 * @return 	array
	 */
	getSectionData() {
		return [
			...(this.props.followData.followOptions.length > 1 && [{
					title: Lang.get("follow_freq"),
					data: ["followChoices"]
			}]),
			{
				title: Lang.get("follow_privacy"),
				data: ["anonToggle"]
			}
		];
	}

	/**
	 * Event handler for selecting a CheckList option. Update our state with
	 * the selected choice.
	 *
	 * @param 	object 		option 		The full data for the selected it
	 * @return 	void
	 */
	toggleNotificationOption(option) {
		if (!option || !option.key) {
			this.setState({
				selectedFollowOption: null
			});
		}

		this.setState({
			selectedFollowOption: option.key
		});
	}

	/**
	 * Event handler for toggling the anonymous option. Update state with the new value.
	 *
	 * @param 	boolean 	value 		Anonymous on or off
	 * @return 	void
	 */
	toggleAnonymousOption(value) {
		this.setState({
			isAnonymous: value
		});
	}

	/**
	 * Renders a cell for the SectionList. We use SectionList here so that we have header 
	 * support without needing to build them manually 
	 *
	 * @param 	object 		item 		The current item we're building
	 * @return 	Component
	 */
	renderItem(item) {
		if (item.item === "followChoices") {
			return this.getChecklist();
		} else if (item.item === "followers") {
			return this.getFollowers();
		} else {
			return <ToggleRow title={Lang.get("follow_anon")} value={this.state.isAnonymous} onToggle={this.toggleAnonymousOption.bind(this)} />;
		}
	}

	render() {
		return (
			<Modal style={componentStyles.modal} swipeDirection="down" onSwipeComplete={this.props.close} isVisible={this.props.isVisible}>
				<View style={componentStyles.modalInner}>
					<View style={styles.modalHandle}></View>
					<SectionList
						sections={this.getSectionData()}
						renderItem={item => this.renderItem(item)}
						renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
						keyExtractor={item => item}
					/>
					<View style={componentStyles.modalBody}>{this.getFollowButtons()}</View>
				</View>
			</Modal>
		);
	}
}

const componentStyles = StyleSheet.create({
	modal: {
		justifyContent: "flex-end",
		margin: 0,
		padding: 0
	},
	modalInner: {
		backgroundColor: "#fff",
		borderRadius: 6,
	},
	followerWrap: {
		backgroundColor: "#f5f5f5",
		padding: styleVars.spacing.wide,
		borderBottomWidth: 1,
		borderBottomColor: styleVars.borderColors.medium
	},
	followerTitle: {
		fontSize: styleVars.fontSizes.small,
		color: styleVars.lightText
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
		backgroundColor: "#f5f5f5",
		padding: styleVars.spacing.wide
	},
	buttonWrap: {
		marginTop: -1
	}
});

export default FollowModal;
