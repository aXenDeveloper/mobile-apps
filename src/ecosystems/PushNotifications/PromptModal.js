import React, { Component } from "react";
import { Image, Text, View, StyleSheet, AsyncStorage } from "react-native";
import { Permissions, Notifications } from "expo";
import Modal from "react-native-modal";
import { connect } from "react-redux";

import Button from "../../atoms/Button";
import Lang from "../../utils/Lang";
import { illustrations } from "../../icons";
import styles, { styleVars } from "../../styles";

class PromptModal extends Component {
	constructor(props) {
		super(props);

		this.onPressAccept = this.onPressAccept.bind(this);
		this.onPressLater = this.onPressLater.bind(this);
	}

	/**
	 * Update
	 *
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {}

	/**
	 * User accepts notifications, so trigger system prompt
	 *
	 * @return 	void
	 */
	async onPressAccept() {
		this.props.close();

		// We'll store a flag saying we've shown the OS popup, because we can't know whether
		// the user actually accepted or not, but in either case we can't show the popup again.
		await AsyncStorage.setItem(
			"@notificationPrompt",
			JSON.stringify({
				status: "accepted",
				timestamp: Math.floor(Date.now() / 1000)
			})
		);

		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	}

	/**
	 * User rejected notifications, so store a timestamp and close
	 *
	 * @return 	void
	 */
	async onPressLater() {
		this.props.close();

		await AsyncStorage.setItem(
			"@notificationPrompt",
			JSON.stringify({
				status: "later",
				timestamp: Math.floor(Date.now() / 1000)
			})
		);
	}

	/**
	 * Text in the notifications will change depending on whether this is multi or single app
	 *
	 * @return 	Component
	 */
	getPromptComponents() {
		if (Expo.Constants.manifest.extra.multi) {
			return (
				<React.Fragment>
					<Text style={[styles.contentTitle, styles.centerText]}>Get content notifications from your favorite communities</Text>
					<Text style={[styles.contentText, styles.lightText, styles.centerText, styles.mtWide]}>
						You can choose which communities you get notifications from later, as well as what kinds of activity you'll be notified about in each.
					</Text>
					<Text style={[styles.contentText, styles.lightText, styles.centerText, styles.mtWide]}>
						You'll only receive notifications when you've created an account in a community and signed in.
					</Text>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<Text style={[styles.contentTitle, styles.centerText]}>Get content notifications from {this.props.site.settings.board_name}</Text>
					<Text style={[styles.contentText, styles.lightText, styles.centerText, styles.mtWide]}>
						You can choose which kinds of activity you'll be notified about later.
					</Text>
					<Text style={[styles.contentText, styles.lightText, styles.centerText, styles.mtWide]}>
						You'll only receive notifications once you've created an account and signed in.
					</Text>
				</React.Fragment>
			);
		}
	}

	render() {
		return (
			<Modal animationIn="fadeIn" isVisible={this.props.isVisible}>
				<View style={[styles.modal, styles.flexShrink, styles.pvExtraWide, componentStyles.modal]}>
					<View style={[styles.flexRow, styles.flexAlignCenter, styles.flexJustifyCenter, componentStyles.imageWrapper]}>
						<Image source={illustrations.NOTIFICATIONS} resizeMode="contain" style={componentStyles.image} />
					</View>
					<View style={[styles.pExtraWide]}>{this.getPromptComponents()}</View>
					<View style={styles.phExtraWide}>
						<Button filled rounded size="large" type="primary" onPress={this.onPressAccept} title="Enable Notifications" />
						<Button filled rounded size="large" type="light" onPress={this.onPressLater} title="Not Now" style={styles.mtTight} />
					</View>
				</View>
			</Modal>
		);
	}
}

const componentStyles = StyleSheet.create({
	modal: {
		backgroundColor: "#fff",
		minHeight: 200
	},
	image: {
		width: 100,
		height: 100
	}
});

export default connect(state => ({
	site: state.site
}))(PromptModal);