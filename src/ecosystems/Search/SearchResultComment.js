import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import Lang from "../../utils/Lang";
import highlightTerms from "../../utils/highlightTerms";
import UserPhoto from "../../atoms/UserPhoto";
import UnreadIndicator from "../../atoms/UnreadIndicator";
import relativeTime from "../../utils/RelativeTime";
import styles, { styleVars } from "../../styles";

const SearchResultComment = props => (
	<React.Fragment>
		<View style={componentStyles.commentHeader}>
			<View style={componentStyles.commentItemInfo}>
				<Text style={[styles.smallItemTitle, styles.mrWide, styles.flexReset]} numberOfLines={1}>
					<UnreadIndicator show={props.data.unread} />
					{highlightTerms(props.data.title, props.term, styles.highlightedText)}
				</Text>
				<Text style={[styles.lightText]}>{relativeTime.short(props.data.updated)}</Text>
			</View>
			<Text style={[styles.lightText, componentStyles.commentItemMeta]}>
				{props.data.replies !== null && `${Lang.pluralize(Lang.get("replies"), props.data.replies)} - `}
				{Lang.get("item_in_container", { item: props.data.articleLang.definiteUC, container: props.data.containerTitle })}
			</Text>
		</View>
		<View style={[componentStyles.commentReplyWrap, styles.mtTight]}>
			<View style={[componentStyles.commentUserInfo]}>
				<UserPhoto size={18} url={props.data.author.photo} />
				<Text style={[styles.standardText, styles.mlVeryTight]}>{Lang.get("name_replied", { name: props.data.author.name })}</Text>
			</View>
			<Text style={[styles.standardText, styles.mtTight]} numberOfLines={2}>
				{highlightTerms(props.data.content.trim(), props.term, styles.highlightedText)}
			</Text>
		</View>
	</React.Fragment>
);

export default SearchResultComment;

const componentStyles = StyleSheet.create({
	commentHeader: {
		marginHorizontal: styleVars.spacing.wide
	},
	commentItemInfo: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	commentReplyWrap: {
		borderLeftWidth: 3,
		borderLeftColor: styleVars.borderColors.dark,
		paddingLeft: styleVars.spacing.tight,
		marginHorizontal: styleVars.spacing.wide
	},
	commentUserInfo: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center"
	}
});
