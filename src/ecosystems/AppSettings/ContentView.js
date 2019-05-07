import React, { Component } from "react";
import { Text, View, FlatList, ScrollView } from "react-native";
import { connect } from "react-redux";

import { setContentView } from "../../redux/actions/app";
import CheckList from "../../ecosystems/CheckList";
import styles from "../../styles";

class ContentView extends Component {
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
	}

	/**
	 * Return the content view options available and their checked status
	 *
	 * @return 	array
	 */
	getViewOptions() {
		return [
			{
				key: "unread",
				title: "Start at first unread comment",
				subText: Expo.Constants.manifest.extra.multi === true ? "Applies when signed in to a community" : null,
				checked: this.props.app.settings.contentView === "unread"
			},
			{
				key: "first",
				title: "Start at the first comment",
				checked: this.props.app.settings.contentView === "first"
			},
			{
				key: "last",
				title: "Start at the most recent comment",
				checked: this.props.app.settings.contentView === "last"
			}
		];
	}

	/**
	 * Dispatch an action when an option is tapped
	 *
	 * @return 	void
	 */
	onPress(selected) {
		this.props.dispatch(setContentView(selected.key));
	}

	render() {
		return (
			<View>
				<CheckList type="radio" data={this.getViewOptions()} onPress={this.onPress} />
				<View style={[styles.mtTight, styles.phWide]}>
					<Text style={[styles.smallText, styles.lightText]}>Determines where you are taken when tapping into content. Applies only to this device.</Text>
				</View>
			</View>
		);
	}
}

export default connect(state => ({
	app: state.app
}))(ContentView);
