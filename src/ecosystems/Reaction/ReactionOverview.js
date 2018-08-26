import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight} from 'react-native';

export default class ReactionOverview extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		// Clone and reverse reaction data so that we can show them layered on top of each other
		// Style uses row-reverse to put them back in the right order
		const reactions = this.props.reactions.slice(0).reverse();

		return (
			<View style={[componentStyles.wrapper, this.props.style]}>
				{reactions.map( (reaction, idx) => <Image source={{ uri: reaction.image }} key={reaction.id} style={[componentStyles.reaction, idx === 0 ? componentStyles.first : null]} />)}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		display: 'flex',
		flexDirection: 'row-reverse',
		justifyContent: 'flex-end',
	},
	reaction: {
		width: 24,
		height: 24,
		marginVertical: 0,
		marginRight: -7
	},
	first: {
		marginLeft: 0
	}
});