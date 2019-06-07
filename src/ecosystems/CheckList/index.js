import React, { Component } from "react";
import { Text, View, FlatList, LayoutAnimation } from "react-native";

import CheckListRow from "../../atoms/CheckListRow";

const CheckList = props => (
	<FlatList
		data={props.data}
		renderItem={({ item }) => (
			<CheckListRow
				{...item}
				onPress={() => {
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
					props.onPress(item);
				}}
			/>
		)}
	/>
);

export default CheckList;
