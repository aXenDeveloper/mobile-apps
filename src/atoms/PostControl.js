import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import _ from "underscore";

export default class PostControl extends Component {	
	constructor(props) {
		super(props);
	}

	getIcon() {
		let image;

		if( !this.props.image ){
			return null;
		}

		if( _.isString( this.props.image ) && this.props.image.startsWith('http') ){
			image = { uri: this.props.image };
		} else {
			image = this.props.image;
		}

		if( image ){
			return <Image source={image} style={styles.image} resizeMode='contain' />;
		}
	}

	render() {
		return (
			<TouchableOpacity style={styles.control} onLongPress={this.props.onLongPress || null} onPress={this.props.onPress || null}>
				<View testId={this.props.testId} style={[ styles.container, this.props.selected ? styles.selected : null ]}>
					{this.getIcon()}
					<Text style={[ styles.text, this.props.selected ? styles.selectedText : null, this.props.textStyle ]}>{this.props.label}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	control: {
		paddingVertical: 4,
		flex: 1
	},
	container: {
		paddingVertical: 8,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	selected: {
		backgroundColor: '#f5f5f5',
		borderRadius: 2
	},
	image: {
		width: 18,
		height: 18,
		marginRight: 4
	},
	text: {
		fontSize: 15,
		fontWeight: "500",
		color: '#171717',
		textAlign: 'center'
	},
	selectedText: {
		color: '#000',
	}
});