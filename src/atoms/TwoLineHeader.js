import React, { memo } from "react";
import { Text, View, StyleSheet } from "react-native";

import { PlaceholderElement, PlaceholderContainer } from "../ecosystems/Placeholder";
import styles from "../styles";

const TwoLineHeader = props => {
	if (props.loading) {
		return (
			<PlaceholderContainer style={{ flex: 1 }}>
				<PlaceholderElement width="70%" height={17} left="15%" top={10} from="rgba(255,255,255,0.2)" to="rgba(255,255,255,0.7)" />
				<PlaceholderElement width="40%" height={12} left="30%" top={32} from="rgba(255,255,255,0.2)" to="rgba(255,255,255,0.7)" />
			</PlaceholderContainer>
		);
	} else {
		return (
			<View style={props.style}>
				<Text style={styles.headerTitle} numberOfLines={1}>
					{props.title}
				</Text>
				<Text style={styles.headerSubtitle}>{props.subtitle}</Text>
			</View>
		);
	}
};

export default memo(TwoLineHeader);
