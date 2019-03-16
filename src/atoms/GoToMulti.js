import React, { Component } from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';

import NavigationService from '../utils/NavigationService';
import HeaderButton from './HeaderButton';
import styles, { styleVars } from '../styles';
import icons from '../icons';
import { switchAppView } from "../redux/actions/app";
import configureStore from "../redux/configureStore";

const store = configureStore();

export default class GoToMulti extends Component {	
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
	}

	onPress() {
		//NavigationService.navigateToScreen('Multi', {}, 'multi');
		store.dispatch( switchAppView({ view: 'multi' } ) );
	}

	render() {
		if( !Expo.Constants.manifest.extra.multi ){
			return null;
		}

		return (
			<HeaderButton icon={icons.BARS} position='left' onPress={this.onPress} size={20} />
		);
	}
}