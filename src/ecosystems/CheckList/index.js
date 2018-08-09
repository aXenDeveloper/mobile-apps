import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";

import CheckListRow from "../../atoms/CheckListRow";

class CheckList extends Component {
	render() {
		return <FlatList 
			data={this.props.data}
			renderItem={({item}) => <CheckListRow {...item} />}
		/>;
	}
}

export default CheckList;
