import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import ContentRow from '../../ecosystems/ContentRow';
import UserPhoto from '../../atoms/UserPhoto';
import relativeTime from '../../utils/RelativeTime';
import stylesheet from '../../styles';

export default class NotificationRow extends Component {	
	constructor(props) {
		super(props);

		console.log( props );
	}

	render() {
		return (
			<ContentRow unread={this.props.data.unread} onPress={this.props.onPress} >
				<View style={styles.rowInner}>
					<View style={styles.author}>
						<UserPhoto url={this.props.data.photo} size={42} />
					</View>
					<View style={styles.info}>
						<View style={styles.title}>
							<Text style={[styles.titleText, this.props.data.unread ? stylesheet.title : stylesheet.titleRead]}>{this.props.data.title}</Text>
						</View>
						<Text style={[ styles.meta, stylesheet.smallText, stylesheet.lightText ]}>
							{relativeTime.long(this.props.data.date)}
						</Text>
					</View>
				</View>
			</ContentRow>
		);
	}
}

const styles = StyleSheet.create({
	rowInner: {
		paddingLeft: 9,
		paddingRight: 16,
		paddingVertical: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'stretch'
	},
	info: {
		flex: 1
	},
	title: {		
		marginBottom: 2,
		flexDirection: 'row'
	},
	titleText: {
		fontSize: 15,
	},
	author: {
		paddingRight: 9,
		paddingTop: 3
	}
});