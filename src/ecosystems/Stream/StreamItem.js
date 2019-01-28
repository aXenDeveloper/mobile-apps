import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
import RichTextContent from "../../ecosystems/RichTextContent";
import { ReactionOverview } from "../../ecosystems/Reaction";
import relativeTime from "../../utils/RelativeTime";
import styles from "../../styles";
import componentStyles from "./styles";

const StreamItem = (props) => {
	let replies;
	let reactions;

	if( props.data.replies !== null ){
		replies = ( 
			<Text style={styles.lightText} numberOfLines={1}>
				{`${Lang.pluralize(Lang.get("replies"), props.data.replies)}`}
			</Text> 
		);
	}

	if( props.data.reactions.length ){
		reactions = (
			<ReactionOverview small style={componentStyles.reactionOverview} reactions={props.data.reactions} />
		)
	}

	return (
		<React.Fragment>
			<View style={componentStyles.streamHeader}>
				<View style={[ componentStyles.streamMeta, styles.mbStandard ]}>
					<View style={componentStyles.streamMetaInner}>
						<UserPhoto url={props.data.author.photo} size={20} />
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]}>{props.metaString}</Text>
					</View>
					<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaTime]}>{relativeTime.short(props.data.updated)}</Text>
				</View>
				<View style={componentStyles.streamItemInfo}>
					<View style={[componentStyles.streamItemInfoInner, componentStyles.streamItemInfoInnerWithPhoto]}>
						<Text style={styles.itemTitle}>{props.data.title}</Text>
						<Text style={componentStyles.streamItemContainer}>In {props.data.containerTitle}</Text>
					</View>
				</View>
			</View>
			{props.image || null}
			<View style={componentStyles.streamContent}>
				{props.data.content && (
					<Text style={componentStyles.snippetText} numberOfLines={3}>
						{props.data.content}
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

export default StreamItem;
