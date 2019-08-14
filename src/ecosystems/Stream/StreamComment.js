import React, { memo } from "react";
import { Text, View } from "react-native";

import UserPhoto from "../../atoms/UserPhoto";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import { ReactionOverview } from "../../ecosystems/Reaction";
import relativeTime from "../../utils/RelativeTime";
import _componentStyles from "./styles";
import { withTheme } from "../../themes";

const StreamComment = props => {
	const { componentStyles, styles } = props;
	const hidden = props.data.hiddenStatus !== null;

	return (
		<React.Fragment>
			<View style={componentStyles.streamHeader}>
				<View style={componentStyles.streamMeta}>
					<View style={componentStyles.streamMetaInner}>
						<UserPhoto url={props.data.author.photo} size={20} />
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction, hidden && styles.moderatedText]}>{props.metaString}</Text>
					</View>
					<Text style={[componentStyles.streamMetaText, styles.lightText, hidden && styles.moderatedLightText]}>{relativeTime.short(props.data.updated)}</Text>
				</View>
			</View>
			<View style={[componentStyles.streamContent, componentStyles.streamContentIndented]}>
				<View style={componentStyles.streamItemInfo}>
					<View style={componentStyles.streamItemInfoInner}>
						<Text style={[styles.smallItemTitle, hidden && styles.moderatedTitle]}>
							<UnreadIndicator show={props.data.unread} />
							{props.data.title}
						</Text>
						<Text style={[componentStyles.streamItemContainer, hidden && styles.moderatedLightText]}>In {props.data.containerTitle}</Text>
					</View>
				</View>
				<View style={componentStyles.snippetWrapper}>
					<Text style={[componentStyles.snippetText, hidden && styles.moderatedText]} numberOfLines={2}>
						{props.data.content}
					</Text>
				</View>
				{Boolean(props.data.reactions.length) && (
					<View style={componentStyles.streamFooter}>
						<ReactionOverview small style={componentStyles.reactionOverview} reactions={props.data.reactions} />
					</View>
				)}
			</View>
		</React.Fragment>
	);
};

export default withTheme(_componentStyles)(memo(StreamComment));
