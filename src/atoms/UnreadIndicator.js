import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { styleVars } from '../styles';

export default class UnreadIndicator extends Component {	
	constructor(props) {
		super(props);
		this.onLayout = this.onLayout.bind(this);
	}

	/**
	 * Event handler for the wrapper's onLayout callback
	 * We use this to pass the height to interested components
	 *
	 * @param 	object 		event 		Event object
	 * @return 	void
	 */
	onLayout(event) {
		if( this.props.onLayout ){
			const { height } = event.nativeEvent.layout;

			this.props.onLayout({
				id: 'unread',
				height
			});
		}
	}

	render() {
		return (
			<View style={styles.wrapper} onLayout={this.onLayout}>
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
		height: 1,
		borderRadius: 5,
		backgroundColor: '#9da5ad'
	},
	text: {
		fontSize: 10,
		fontWeight: "500",
		backgroundColor: styleVars.appBackground,
		color: '#9da5ad',
		//paddingHorizontal: 9,
		//width: 120,
		textAlign: 'center',
		position: 'absolute',
		/*left: '50%',
		marginLeft: -60,*/
		paddingRight: 9,
		left: 0,
		top: -5
	}
});

UnreadIndicator.defaultProps = {
	label: 'Unread Comments'
};

UnreadIndicator.propTypes = {
	label: PropTypes.string
};