import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class UnreadIndicator extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<Text style={styles.text}>{this.props.label.toUpperCase()}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		marginHorizontal: 12,
		marginBottom: 27,
		marginTop: 20,
		height: 3,
		borderRadius: 5,
		backgroundColor: '#d6d7d8'
	},
	text: {
		fontSize: 9,
		fontWeight: "500",
		color: 'rgba(0,0,0,0.7)',
		backgroundColor: '#d6d7d8',
		paddingVertical: 3,
		paddingHorizontal: 9,
		borderRadius: 15,
		width: 120,
		textAlign: 'center',
		position: 'absolute',
		left: '50%',
		marginLeft: -60,
		top: -7
	}
});

UnreadIndicator.defaultProps = {
	label: 'Unread Comments'
};

UnreadIndicator.propTypes = {
	label: PropTypes.string
};