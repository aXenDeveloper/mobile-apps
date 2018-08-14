import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

export default class AddButton extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableOpacity style={styles.button} onPress={this.props.onPress}>
				<React.Fragment>
					<Image style={styles.icon} resizeMode='stretch' source={this.props.icon} /> 
					<Text style={styles.text}>{this.props.title}</Text>
				</React.Fragment>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
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