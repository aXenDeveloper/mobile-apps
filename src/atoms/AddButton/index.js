import React, { Component } from 'react';
import { StyleSheet, Image, TouchableHighlight, Text } from 'react-native';

export default class AddButton extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight style={styles.button} onPress={this.props.onPress}>
				<React.Fragment>
					<Image style={styles.icon} resizeMode='stretch' source={this.props.icon} /> 
					<Text style={styles.text}>{this.props.title}</Text>
				</React.Fragment>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#3271aa',
		paddingHorizontal: 10,
		height: 30,
		borderRadius: 30,
		position: 'absolute',
		right: 15,
		bottom: 15,
		marginLeft: -60,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	icon: {
		width: 16,
		height: 16
	},
	text: {
		color: '#fff',
		fontSize: 15,
		marginLeft: 6
	}
});