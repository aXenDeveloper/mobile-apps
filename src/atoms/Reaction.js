import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight} from 'react-native';

export default class Reaction extends Component {	
	constructor(props) {
		super(props);
	}

	/**
	 * Event handler for tapping this reaction
	 *
	 * @return 	void
	 */
	onPress = () => {
		this.props.onPress(this.props.id);
	}

	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress ? this.onPress : null} key={this.props.id} style={[this.props.style, styles.reactionWrapper]}>
				<View style={styles.reaction}>
					<Image source={{ uri: this.props.image }} style={styles.reactionImage} resizeMode='cover' />
					<Text style={styles.reactionCount}>{this.props.count}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	reactionWrapper: {
		borderRadius: 4
	},
	reaction: {
		backgroundColor: '#F0F0F0',
		padding: 5,
		borderRadius: 4,
		flexGrow: 0,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		height: 26,
	},
	reactionImage: {
		width: 16,
		height: 16
	},
	reactionCount: {
		color: '#000',
		fontSize: 12,
		fontWeight: 'bold',
		paddingLeft: 5,
		paddingRight: 5
	}
});