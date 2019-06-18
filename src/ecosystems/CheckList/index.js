import React, { Component } from "react";
import { Text, View, FlatList, LayoutAnimation } from "react-native";
import _ from "underscore";

import CheckListRow from "../../atoms/CheckListRow";
import styles from "../../styles";

const handlers = {};

const getHandler = (item, onPress) => {
	if (_.isUndefined(handlers[item.key])) {
		handlers[item.key] = () => {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			onPress(item);
		};
	}

	return handlers[item.key];
};
const CheckList = props => {
	return (
		<FlatList
			style={props.style}
			data={props.data}
			renderItem={({ item }) => <CheckListRow {...item} onPress={!props.disabled ? getHandler(item, props.onPress) : null} />}
		/>
	);
};

export default CheckList;
