import React, { Component } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';

import NavigationService from '../utils/NavigationService';
import HeaderButton from './HeaderButton';
import styles, { styleVars } from '../styles';
import icons from '../icons';

export default class GoToMulti extends Component {	
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
	}

	onPress() {
		NavigationService.navigateToScreen('Multi', {}, 'multi');
	}

	render() {
		return (
			<HeaderButton icon={icons.BARS} position='left' onPress={this.onPress} size={20} />
		);
	}
}