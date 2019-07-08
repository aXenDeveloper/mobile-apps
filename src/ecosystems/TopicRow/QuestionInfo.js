import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableHighlight } from "react-native";

import Lang from "../../utils/Lang";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import TopicIcon from "../../atoms/TopicIcon";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import LockedIcon from "../../atoms/LockedIcon";
import styles, { styleVars } from "../../styles";

class QuestionInfo extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[this.props.styles.topicRowInner, componentStyles.questionRowInner]}>
				<View style={this.props.styles.topicInfo}>
					<View style={this.props.styles.topicTitle}>
						{Boolean(this.props.showAsUnread) && <TopicIcon style={this.props.styles.topicIcon} unread={this.props.data.unread} />}
						{Boolean(this.props.data.isLocked) && <LockedIcon style={this.props.styles.lockedIcon} />}
						<Text style={[this.props.styles.topicTitleText, this.props.showAsUnread ? styles.title : styles.titleRead]} numberOfLines={1}>
							<UnreadIndicator show={this.props.data.unread} />
							{this.props.data.title}
						</Text>
					</View>
					<Text style={[this.props.styles.topicSnippet, this.props.showAsUnread ? styles.text : styles.textRead]} numberOfLines={1}>
						{this.props.data.snippet}
					</Text>
				</View>
				<View style={[styles.flexColumn, styles.flexJustifyCenter, styles.mlWide, styles.phWide, componentStyles.questionInfo]}>
					<Text style={[styles.centerText, styles.largeText, styles.boldText, componentStyles.voteCount]}>{this.props.data.questionVotes}</Text>
					<Text style={[styles.centerText, styles.tinyText, styles.lightText]}>{Lang.pluralize(Lang.get("votes_nonum"), this.props.data.questionVotes)}</Text>
				</View>
			</View>
		);
	}
}

export default QuestionInfo;

const componentStyles = StyleSheet.create({
	questionRowInner: {
		paddingRight: 0
	},
	questionInfo: {
		minWidth: 80,
		borderLeftWidth: 1,
		borderLeftColor: styleVars.borderColors.medium
	},
	voteCount: {
		fontSize: 18,
		fontWeight: "300"
	}
});
