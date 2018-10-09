import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
import RichTextContent from "../../atoms/RichTextContent";
import { ReactionOverview } from "../../ecosystems/Reaction";
import relativeTime from "../../utils/RelativeTime";
import styles from "../../styles";
import componentStyles from "./styles";

export default class StreamItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let replies;
		let reactions;

		if( this.props.data.replies !== null ){
			replies = ( 
				<Text style={styles.lightText} numberOfLines={1}>
					{`${Lang.pluralize(Lang.get("replies"), this.props.data.replies)}`}
				</Text> 
			);
		}

		if( this.props.data.reactions.length ){
			reactions = (
				<ReactionOverview small style={componentStyles.reactionOverview} reactions={this.props.data.reactions} />
			)
		}

		return (
			<React.Fragment>
				<View style={componentStyles.streamHeader}>
					<View style={[ componentStyles.streamMeta, styles.mbStandard ]}>
						<View style={componentStyles.streamMetaInner}>
							<UserPhoto url={this.props.data.author.photo} size={20} />
							<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]}>{this.props.metaString}</Text>
						</View>
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaTime]}>{relativeTime.short(this.props.data.updated)}</Text>
					</View>
					<View style={componentStyles.streamItemInfo}>
						<View style={[componentStyles.streamItemInfoInner, componentStyles.streamItemInfoInnerWithPhoto]}>
							<Text style={styles.itemTitle}>{this.props.data.title}</Text>
							<Text style={componentStyles.streamItemContainer}>In {this.props.data.containerTitle}</Text>
						</View>
					</View>
				</View>
				{this.props.image || null}
				<View style={componentStyles.streamContent}>
					{this.props.data.content && (
						<Text style={componentStyles.snippetText} numberOfLines={3}>
							{this.props.data.content}
						</Text>
					)}
					{(replies || reactions) && (
						<View style={componentStyles.streamFooter}>
							{reactions} {replies}
						</View>
					)}
				</View>
			</React.Fragment>
		);
	}
}
