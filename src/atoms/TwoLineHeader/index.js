import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { PlaceholderElement, PlaceholderContainer } from '../../atoms/Placeholder';

export default class TwoLineHeader extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		if( this.props.loading ){
			return (
				<PlaceholderContainer style={{flex: 1}}>
					<PlaceholderElement width='70%' height={17} left='15%' top={10} from='rgba(255,255,255,0.2)' to='rgba(255,255,255,0.7)' />
					<PlaceholderElement width='40%' height={12} left='30%' top={32} from='rgba(255,255,255,0.2)' to='rgba(255,255,255,0.7)' />
				</PlaceholderContainer>
			);
		} else {
			return (
				<View>
					<Text style={styles.headerTitle} numberOfLines={1}>{this.props.title}</Text>
					<Text style={styles.headerSubtitle}>{this.props.subtitle}</Text>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	headerTitle: {
		color: 'white',
		fontSize: 17,
		fontWeight: "500",
		textAlign: 'center'
	},	
	headerSubtitle: {
		color: 'white',
		fontSize: 12,
		textAlign: 'center',
		fontWeight: "300",
		opacity: 0.9
	}	
});