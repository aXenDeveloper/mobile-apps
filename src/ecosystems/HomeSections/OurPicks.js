import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableHighlight } from 'react-native';

import LargeTitle from "../../atoms/LargeTitle";
import StreamCard from "../../ecosystems/StreamCard";
import ContentCard from "../../ecosystems/ContentCard";
import Lang from "../../utils/Lang";
import styles, { styleVars } from '../../styles';

class OurPicks extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<LargeTitle icon={require('../../../resources/home_ourpicks.png')}>Our Picks</LargeTitle>
				{!this.props.loading &&
					<FlatList
						horizontal
						snapToInterval={this.props.cardWidth + styleVars.spacing.wide}
						snapToAlignment='start'
						decelerationRate='fast'
						showsHorizontalScrollIndicator={false}
						style={componentStyles.feed}
						data={this.props.data.core.ourPicks.items}
						keyExtractor={item => item.indexID}
						renderItem={({item}) => <ContentCard style={{ width: this.props.cardWidth, marginLeft: styleVars.spacing.wide }} data={item} />}
					/>}
			</React.Fragment>
		);
	}
}

export default OurPicks;

const componentStyles = StyleSheet.create({
	forumItem: {
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 9,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		minHeight: 75
	},
	forumTitle: {
		fontSize: 17,
		color: '#000',
		fontWeight: "600",
		lineHeight: 18,
		marginBottom: 3,
		letterSpacing: -0.2
	},
	iconAndInfo: {
		flexDirection: 'row',
		flex: 1,
		paddingRight: 20
	},
	forumInfo: {
		marginLeft: 9
	},
	forumMeta: {
		fontSize: 15,
		color: '#8F8F8F',
		letterSpacing: -0.2
	}
});