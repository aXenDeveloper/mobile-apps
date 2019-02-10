import React, { PureComponent } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

export default class QuestionVote extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		const voteUpIcon = this.props.hasVotedUp ? icons.VOTE_UP_SOLID : icons.VOTE_UP;
		const voteDownIcon = this.props.hasVotedDown && this.props.downvoteEnabled ? icons.VOTE_DOWN_SOLID : icons.VOTE_DOWN;

		return (
			<View style={[styles.phVeryTight, styles.flexColumn, styles.flexAlignCenter, this.props.smaller ? componentStyles.wrapperSmall : componentStyles.wrapper]}>
				<TouchableOpacity onPress={this.props.canVoteUp ? this.props.onVoteUp : null} style={this.props.smaller ? styles.mbVeryTight : null}>
					<Image
						source={voteUpIcon}
						resizeMode="contain"
						style={[
							componentStyles.voteArrow,
							!Boolean(this.props.canVoteUp) && !Boolean(this.props.hasVotedUp) ? componentStyles.voteDisabled : null, // Disable arrow if they can't vote, and haven't voted
						]}
					/>
				</TouchableOpacity>
				<Text style={[this.props.smaller ? styles.standardText : styles.largeText, styles.mediumText, styles.centerText]}>{this.props.score}</Text>
				{Boolean(this.props.downvoteEnabled) && (
					<TouchableOpacity onPress={this.props.canVoteDown ? this.props.onVoteDown : null} style={this.props.smaller ? styles.mtVeryTight : null}>
						<Image
							source={voteDownIcon}
							resizeMode="contain"
							style={[
								componentStyles.voteArrow,
								!Boolean(this.props.canVoteDown) && !Boolean(this.props.hasVotedDown) ? componentStyles.voteDisabled : null, // Disable arrow if they can't vote, and haven't voted
							]}
						/>
					</TouchableOpacity>
				)}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		width: 70
	},
	wrapperSmall: {
		width: 56
	},
	voteArrow: {
		width: 25,
		height: 20,
		tintColor: styleVars.text
	},
	voteDisabled: {
		opacity: 0.1
	}
});
