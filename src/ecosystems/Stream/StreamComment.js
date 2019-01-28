import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

import UserPhoto from "../../atoms/UserPhoto";
import RichTextContent from "../../ecosystems/RichTextContent";
import { ReactionOverview } from "../../ecosystems/Reaction";
import relativeTime from "../../utils/RelativeTime";
import componentStyles from "./styles";
import styles from "../../styles";

const StreamComment = (props) => (
	<React.Fragment>
		<View style={componentStyles.streamHeader}>
			<View style={componentStyles.streamMeta}>
				<View style={componentStyles.streamMetaInner}>
					<UserPhoto url={props.data.author.photo} size={20} />
					<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]}>{props.metaString}</Text>
				</View>
				<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaTime]}>{relativeTime.short(props.data.updated)}</Text>
			</View>
		</View>
		<View style={[componentStyles.streamContent, componentStyles.streamContentIndented]}>
			<View style={componentStyles.streamItemInfo}>
				<View style={componentStyles.streamItemInfoInner}>
					<Text style={styles.smallItemTitle}>{props.data.title}</Text>
					<Text style={componentStyles.streamItemContainer}>In {props.data.containerTitle}</Text>
				</View>
			</View>
			<View style={componentStyles.snippetWrapper}>
				<Text style={componentStyles.snippetText} numberOfLines={2}>
					{props.data.content}
				</Text>
			</View>
			{props.data.reactions.length && (
				<View style={componentStyles.streamFooter}>
					<ReactionOverview small style={componentStyles.reactionOverview} reactions={props.data.reactions} />
				</View>
			)}
		</View>
	</React.Fragment>
);

export default StreamComment;