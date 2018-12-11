import React, { Component } from "react";
import { Text, Image, View, TouchableHighlight, StyleSheet } from "react-native";
import _ from "underscore";

import Lang from "../../utils/Lang";
import ShadowedArea from "../../atoms/ShadowedArea";
import PostControls from "../../atoms/PostControls";
import PostControl from "../../atoms/PostControl";
import relativeTime from "../../utils/RelativeTime";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

class PollPreview extends Component {
	constructor(props) {
		super(props);
	}

	getCloseText() {
		if( !this.props.data.closeTimestamp && !this.props.data.isClosed ){
			return null;
		}

		let text;

		if( this.props.data.isClosed ){
			text = Lang.get('poll_closed');
		} else if( this.props.data.closeTimestamp ){
			text = Lang.get('poll_closes_date', {
				date: relativeTime.long( parseInt( this.props.data.closeTimestamp ), true )
			});
		}

		return <Text style={[styles.lightText, styles.smallText, styles.mhTight]}>{text}</Text>
	}

	getButtonText(){
		let text = Lang.get('poll_view');

		if( this.props.data.hasVoted ){
			if( this.props.data.canViewResults ){
				text = Lang.get('poll_view_results');
			}
		} else {
			if( this.props.data.canVote ){
				Lang.get('poll_view_and_vote');
			}
		}

		return text;
	}

	render() {
		return (
			<ShadowedArea style={[styles.phWide, styles.ptWide, styles.flexAlignCenter, styles.mbStandard]}>
				<Image source={icons.POLL} resizeMode='contain' style={componentStyles.icon} />
				<Text style={[styles.text, styles.contentText, styles.mediumText, styles.mtStandard]}>{Lang.get('poll_prefix')} {this.props.data.title}</Text>
				<View style={[styles.mtVeryTight, styles.flexRow, styles.flexJustifyCenter]}>
					<Text style={[styles.lightText, styles.smallText, styles.mhTight]}>{Lang.pluralize( Lang.get('votes'), this.props.data.votes )}</Text>
					{this.props.data.hasVoted && <Text style={[styles.lightText, styles.smallText, styles.mhTight]}>{Lang.get('poll_you_voted')}</Text>}
					{this.getCloseText()}
				</View>
				<PostControls style={styles.mtWide}>
					<PostControl testId="viewPoll" label={this.getButtonText()} onPress={this.props.onPress} />
				</PostControls>
			</ShadowedArea>
		);
	}
}

export default PollPreview;

const componentStyles = StyleSheet.create({
	icon: {
		width: 36,
		height: 36,
		tintColor: styleVars.accentColor
	},
	buttonBar: {
		//borderTopWidth: 1,
		//borderTopColor: styleVars.borderColors.medium,
	},
	linkText: {
		fontWeight: "500"
	}
});