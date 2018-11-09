import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import { compose } from "react-apollo";
import { withNavigation } from "react-navigation";

import ContentRow from "../../ecosystems/ContentRow";
import UserPhoto from "../../atoms/UserPhoto";
import relativeTime from "../../utils/RelativeTime";
import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import styles, { styleVars } from "../../styles";

const NotificationRow = props => {
	if (props.loading) {
		return (
			<ContentRow>
				<PlaceholderContainer height={58} style={[styles.mrStandard, styles.mlStandard, styles.mtStandard, styles.mbStandard]}>
					<PlaceholderElement circle radius={42} left={0} top={0} />
					<PlaceholderElement width={300} height={15} top={2} left={42 + styleVars.spacing.standard} />
					<PlaceholderElement width={200} height={12} top={26} left={42 + styleVars.spacing.standard} />
					<PlaceholderElement width={200} height={12} top={44} left={42 + styleVars.spacing.standard} />
				</PlaceholderContainer>
			</ContentRow>
		);
	}

	return (
		<ContentRow unread={props.data.unread} onPress={props.onPress}>
			<View style={componentStyles.rowInner}>
				<View style={componentStyles.author}>
					<UserPhoto url={props.data.author.photo} size={42} />
				</View>
				<View style={componentStyles.content}>
					<View style={componentStyles.metaInfo}>
						<Text style={[styles.smallItemTitle, componentStyles.title, props.data.readDate == null ? styles.title : styles.titleRead]}>
							{props.data.title}
						</Text>
						<Text style={[styles.smallText, styles.lightText]}>{relativeTime.short(props.data.updatedDate)}</Text>
					</View>
					{props.data.content && (
						<Text style={[styles.smallText, styles.lightText]} numberOfLines={2}>
							{props.data.content}
						</Text>
					)}
				</View>
			</View>
		</ContentRow>
	);
};

export default compose(withNavigation)(NotificationRow);

const componentStyles = StyleSheet.create({
	rowInner: {
		paddingHorizontal: styleVars.spacing.standard,
		paddingVertical: styleVars.spacing.standard,
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "stretch"
	},
	author: {
		marginRight: styleVars.spacing.standard
	},
	content: {
		flex: 1
	},
	metaInfo: {
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-start"
	},
	title: {
		fontWeight: "500",
		marginBottom: styleVars.spacing.veryTight,
		flexGrow: 1,
		flexBasis: 0,
		marginRight: styleVars.spacing.standard
	}
});
