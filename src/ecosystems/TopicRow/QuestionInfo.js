import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableHighlight } from "react-native";

import Lang from "../../utils/Lang";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import TopicIcon from "../../atoms/TopicIcon";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import LockedIcon from "../../atoms/LockedIcon";
import styles, { styleVars } from "../../styles";

const QuestionInfo = props => (
	<View style={[props.styles.topicRowInner, componentStyles.questionRowInner]}>
		<View style={props.styles.topicInfo}>
			<View style={props.styles.topicTitle}>
				{Boolean(props.data.isLocked) && <LockedIcon style={props.styles.lockedIcon} />}
				<Text style={[props.styles.topicTitleText, props.showAsUnread ? styles.title : styles.titleRead]} numberOfLines={1}>
					<UnreadIndicator show={props.data.unread} />
					{props.data.title}
				</Text>
			</View>
			<Text style={[props.styles.topicSnippet, props.showAsUnread ? styles.text : styles.textRead]} numberOfLines={1}>
				{props.data.snippet}
			</Text>
		</View>
		<View style={[styles.flexColumn, styles.flexJustifyCenter, styles.mlWide, styles.phWide, componentStyles.questionInfo]}>
			<Text style={[styles.centerText, styles.largeText, styles.boldText, componentStyles.voteCount]}>{props.data.questionVotes}</Text>
			<Text style={[styles.centerText, styles.tinyText, styles.lightText]}>{Lang.pluralize(Lang.get("votes_nonum"), props.data.questionVotes)}</Text>
		</View>
	</View>
);

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
