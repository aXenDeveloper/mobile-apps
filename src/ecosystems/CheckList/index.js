import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";

import CheckListRow from "../../atoms/CheckListRow";

const CheckList = props => <FlatList data={props.data} renderItem={({ item }) => <CheckListRow {...item} onPress={() => props.onPress(item)} />} />;

export default CheckList;
