import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

import UserPhoto from "../../atoms/UserPhoto";
import RichTextContent from "../../atoms/RichTextContent";
import { ReactionOverview } from "../../ecosystems/Reaction";
import relativeTime from "../../utils/RelativeTime";
import componentStyles from "./styles";
import styles from "../../styles";

export default class StreamComment extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<View style={componentStyles.streamHeader}>
					<View style={componentStyles.streamMeta}>
						<View style={componentStyles.streamMetaInner}>
							<UserPhoto url={this.props.data.author.photo} size={20} />
							<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]}>{this.props.metaString}</Text>
						</View>
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaTime]}>{relativeTime.short(this.props.data.updated)}</Text>
					</View>
				</View>
				<View style={[componentStyles.streamContent, componentStyles.streamContentIndented]}>
					<View style={componentStyles.streamItemInfo}>
						<View style={componentStyles.streamItemInfoInner}>
							<Text style={styles.smallItemTitle}>{this.props.data.title}</Text>
							<Text style={componentStyles.streamItemContainer}>In {this.props.data.containerTitle}</Text>
						</View>
					</View>
					<View style={componentStyles.snippetWrapper}>
						<Text style={componentStyles.snippetText} numberOfLines={2}>
							{this.props.data.content}
						</Text>
					</View>
					{this.props.data.reactions.length && (
						<View style={componentStyles.streamFooter}>
							<ReactionOverview small style={componentStyles.reactionOverview} reactions={this.props.data.reactions} />
						</View>
					)}
				</View>
			</React.Fragment>
		);
	}
}

//
