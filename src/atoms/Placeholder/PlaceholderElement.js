import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import _ from "underscore";
import { styleVars } from '../../styles';

export default class PlaceholderElement extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const shapeStyles = {};

		if( this.props.circle ){
			shapeStyles['width'] = this.props.radius || 30;
			shapeStyles['height'] = this.props.radius || 30;
		} else {
			shapeStyles['width'] = this.props.width || '50%';
			shapeStyles['height'] = this.props.height || 15;
		}

		['left', 'right', 'top', 'bottom'].forEach( prop => {
			if( !_.isUndefined( this.props[prop] ) ){
				shapeStyles[prop] = this.props[prop];
			}
		});

		const styles = Object.assign({}, this.props.style, shapeStyles);

		return (
			<View style={[
				componentStyles.base, 
				this.props.circle ? componentStyles.circle : componentStyles.rect,
				styles
			]}>
				<Text>&nbsp;</Text>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	base: {
		backgroundColor: styleVars.placeholderColor,
		position: 'absolute'
	},
	circle: {
		borderRadius: 150
	},
	rect: {
		borderRadius: 3
	}
});