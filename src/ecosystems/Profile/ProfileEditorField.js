import React, { Component } from "react";
import { View } from "react-native";

import RichTextContent from "../../ecosystems/RichTextContent";
import styles from "../../styles";

const ProfileEditorField = props => {
	if (!props.isActive) {
		return <View />;
	}

	let value;

	try {
		value = JSON.parse(props.content);
	} catch (err) {
		console.log(`Invalid JSON in Editor field`);
		return null;
	}

	return (
		<View style={[styles.flex, styles.pWide]}>
			<RichTextContent>{value}</RichTextContent>
		</View>
	);
};

export default ProfileEditorField;
