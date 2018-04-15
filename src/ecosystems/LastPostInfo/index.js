import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import UserPhoto from '../../atoms/UserPhoto';
import relativeTime from '../../utils/RelativeTime';

export default class LastPostInfo extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		if( this.props.photo && this.props.timestamp ){
			return (
				<View style={this.props.style}>
					<UserPhoto url={this.props.photo} />
					<Text style={styles.timestamp}>{relativeTime.short(this.props.timestamp)}</Text>
				</View>
			);
		}

		return null;
	}
}

const styles = StyleSheet.create({
	timestamp: {
		fontSize: 12,
		color: '#8F8F8F',
		textAlign: 'center',
		marginTop: 3
	}
});