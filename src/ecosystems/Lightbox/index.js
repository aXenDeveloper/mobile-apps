import React, { Component } from 'react';
import { Text, Image, View, Animated, Easing, AsyncStorage, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from "react-native-modal";

import Lang from "../../utils/Lang";
import styles, { styleVars } from '../../styles';

export default class Lightbox extends Component {	
	constructor(props) {
		super(props);
		
	}

	/**
	 * Render
	 *
	 * @return 	Component
	 */
	render() {
		return (
			<Modal
				style={componentStyles.modal}
				avoidKeyboard={true}
				animationIn="bounceIn"
				isVisible={this.props.isVisible}
			>
				{Object.keys(this.props.data).map((url) => <Text>{url}</Text>)}
			</Modal>
		);
	}
}

const componentStyles = StyleSheet.create({
	
});