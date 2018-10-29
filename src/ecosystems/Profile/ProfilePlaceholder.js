import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

import { PlaceholderRepeater, PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";

const ProfilePlaceholder = () => (
	<PlaceholderContainer style={{ flex: 1 }}>
		<PlaceholderContainer height={250}>
			<PlaceholderElement width='100%' height={250} from='#333' to='#444' top={0} left={0} />
			<PlaceholderElement circle radius={80} top={40} left='50%' style={{ marginLeft: -40 }} />
			<PlaceholderElement width={150} left='50%' top={140} style={{ marginLeft: -75 }} height={16} />
			<PlaceholderElement width={100} left='50%' top={165} style={{ marginLeft: -50 }} height={12} />
			<PlaceholderElement width='100%' top={195} left={0} right={0} height={60} style={{ opacity: 0.2 }} />
		</PlaceholderContainer>
		<PlaceholderContainer style={{ flex: 1 }}>
			<PlaceholderContainer height={48} style={componentStyles.loadingTabBar}>
				<PlaceholderElement width={70} height={14} top={17} left={13} />
				<PlaceholderElement width={80} height={14} top={17} left={113} />
				<PlaceholderElement width={90} height={14} top={17} left={225} />
				<PlaceholderElement width={70} height={14} top={17} left={345} />
			</PlaceholderContainer>
		</PlaceholderContainer>
	</PlaceholderContainer>

);

export default ProfilePlaceholder;

const componentStyles = StyleSheet.create({
	loadingTabBar: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#cccccc"
	}
});