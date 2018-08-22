import React, { Component } from "react";
import {
	Text,
	View,
	FlatList,
	StyleSheet,
	TouchableHighlight
} from "react-native";
import _ from "underscore";

import LargeTitle from "../../atoms/LargeTitle";
import StreamCard from "../../ecosystems/StreamCard";
import ContentCard from "../../ecosystems/ContentCard";
import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";

class NewContent extends Component {
	constructor(props) {
		super(props);
	}

	getDummyData() {
		return _.range(5).map(idx => ({ key: idx.toString() }));
	}

	render() {
		return (
			<FlatList
				horizontal
				snapToInterval={
					this.props.cardWidth + styleVars.spacing.wide
				}
				snapToAlignment="start"
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
				style={componentStyles.feed}
				data={
					this.props.loading
						? this.getDummyData()
						: this.props.data.core.newContent.items
				}
				keyExtractor={item => this.props.loading ? item.key : item.indexID}
				renderItem={({ item }) => (
					<ContentCard
						style={{
							width: this.props.cardWidth,
							marginLeft: styleVars.spacing.wide
						}}
						loading={this.props.loading}
						data={this.props.loading ? null : item}
					/>
				)}
			/>
		);
	}
}

export default NewContent;

const componentStyles = StyleSheet.create({
	
});
