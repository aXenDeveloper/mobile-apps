import React, { Component } from "react";
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import Lang from "../../utils/Lang";
import highlightTerms from "../../utils/highlightTerms";
import UserPhoto from "../../atoms/UserPhoto";
import relativeTime from "../../utils/RelativeTime";
import styles, { styleVars } from "../../styles";

const SearchResultItem = props => (
	<React.Fragment>
		<View style={componentStyles.itemHeader}>
			<View style={[componentStyles.itemUserInfo, styles.mrWide, styles.flexReset]}>
				<UserPhoto size={22} url={props.data.author.photo} />
				<Text style={[styles.contentText, styles.mlTight]}>{props.data.author.name}</Text>
			</View>
			<Text style={[styles.lightText]}>{relativeTime.short(props.data.updated)}</Text>
		</View>
		<View style={componentStyles.itemBody}>
			<Text style={styles.itemTitle} numberOfLines={1}>
				{highlightTerms(props.data.title, props.term, styles.highlightedText)}
			</Text>
			<Text style={styles.contentText} numberOfLines={2}>
				{highlightTerms(props.data.content.trim(), props.term, styles.highlightedText)}
			</Text>
		</View>
		<View style={componentStyles.itemMeta}>
			<Text style={styles.lightText} numberOfLines={1}>
				{Lang.pluralize(Lang.get("replies"), props.data.replies)} &middot; {props.data.articleLang.definiteUC} in{" "}
				{props.data.containerTitle}
			</Text>
		</View>
	</React.Fragment>
);

export default SearchResultItem;

const componentStyles = StyleSheet.create({
	itemHeader: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: styleVars.spacing.wide
	},
	itemUserInfo: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center"
	},
	itemBody: {
		marginTop: styleVars.spacing.tight,
		marginHorizontal: styleVars.spacing.wide
	},
	itemMeta: {
		marginHorizontal: styleVars.spacing.wide,
		marginTop: styleVars.spacing.tight
	}
});
