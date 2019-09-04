import React, { memo } from "react";
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";
import formatNumber from "../../utils/formatNumber";
import UserPhoto from "../../atoms/UserPhoto";
import RichTextContent from "../../ecosystems/RichTextContent";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import { ReactionOverview } from "../../ecosystems/Reaction";
import Time from "../../atoms/Time";
import styles from "../../styles";
import componentStyles from "./styles";

const StreamItem = props => {
	const hidden = props.data.hiddenStatus !== null;

	return (
		<React.Fragment>
			<View style={componentStyles.streamHeader}>
				<View style={[componentStyles.streamMeta, props.data.title !== null || Boolean(props.data.containerTitle) ? styles.mbStandard : null]}>
					<View style={componentStyles.streamMetaInner}>
						<UserPhoto url={props.data.author.photo} size={20} />
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction, hidden && styles.moderatedText]}>{props.metaString}</Text>
					</View>
					<Time style={[componentStyles.streamMetaText, styles.lightText, hidden && styles.moderatedLightText]} timestamp={props.data.updated} />
				</View>
				{(props.data.title !== null || Boolean(props.data.containerTitle)) && (
					<View style={componentStyles.streamItemInfo}>
						<View style={[componentStyles.streamItemInfoInner, componentStyles.streamItemInfoInnerWithPhoto]}>
							{props.data.title !== null && (
								<Text style={[styles.itemTitle, hidden && styles.moderatedTitle]}>
									<UnreadIndicator show={props.data.unread} />
									{props.data.title}
								</Text>
							)}
							{Boolean(props.data.containerTitle) && (
								<Text style={[componentStyles.streamItemContainer, hidden && styles.moderatedLightText]}>
									{Lang.get("in_container", { container: props.data.containerTitle })}
								</Text>
							)}
						</View>
					</View>
				)}
			</View>
			{props.image || null}
			<View style={componentStyles.streamContent}>
				{Boolean(props.data.content) && (
					<Text style={[componentStyles.snippetText, hidden && styles.moderatedText]} numberOfLines={3}>
						{props.data.content}
					</Text>
				)}
				{(Boolean(props.data.reactions.length) || props.data.replies !== null) && (
					<View style={componentStyles.streamFooter}>
						{Boolean(props.data.reactions.length) && <ReactionOverview small style={componentStyles.reactionOverview} reactions={props.data.reactions} />}
						{props.data.replies !== null && (
							<Text style={[styles.lightText, hidden && styles.moderatedLightText]} numberOfLines={1}>
								{`${Lang.pluralize(Lang.get("replies"), formatNumber(props.data.replies))}`}
							</Text>
						)}
					</View>
				)}
			</View>
		</React.Fragment>
	);
};

export default memo(StreamItem);
