import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";
import UserPhoto from "../../atoms/UserPhoto";
import RichTextContent from "../../ecosystems/RichTextContent";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import { ReactionOverview } from "../../ecosystems/Reaction";
import relativeTime from "../../utils/RelativeTime";
import styles from "../../styles";
import componentStyles from "./styles";

const StreamItem = props => {
	return (
		<React.Fragment>
			<View style={componentStyles.streamHeader}>
				<View style={[componentStyles.streamMeta, styles.mbStandard]}>
					<View style={componentStyles.streamMetaInner}>
						<UserPhoto url={props.data.author.photo} size={20} />
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]}>{props.metaString}</Text>
					</View>
					<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaTime]}>{relativeTime.short(props.data.updated)}</Text>
				</View>
				<View style={componentStyles.streamItemInfo}>
					<View style={[componentStyles.streamItemInfoInner, componentStyles.streamItemInfoInnerWithPhoto]}>
						<Text style={styles.itemTitle}>
							<UnreadIndicator show={props.data.unread} />
							{props.data.title}
						</Text>
						<Text style={componentStyles.streamItemContainer}>In {props.data.containerTitle}</Text>
					</View>
				</View>
			</View>
			{props.image || null}
			<View style={componentStyles.streamContent}>
				{Boolean(props.data.content) && (
					<Text style={componentStyles.snippetText} numberOfLines={3}>
						{props.data.content}
					</Text>
				)}
				{(Boolean(props.data.reactions.length) || props.data.replies !== null) && (
					<View style={componentStyles.streamFooter}>
						{Boolean(props.data.reactions.length) && <ReactionOverview small style={componentStyles.reactionOverview} reactions={props.data.reactions} />}
						{props.data.replies !== null && (
							<Text style={styles.lightText} numberOfLines={1}>
								{`${Lang.pluralize(Lang.get("replies"), props.data.replies)}`}
							</Text>
						)}
					</View>
				)}
			</View>
		</React.Fragment>
	);
};

export default StreamItem;
