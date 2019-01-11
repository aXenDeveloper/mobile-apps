import React, { PureComponent } from 'react';
import { Text, View, Button, StyleSheet, TouchableHighlight, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import PropTypes from "prop-types";

import ActionBar from "./ActionBar";
import styles, { styleVars } from "../styles";

export default class Pager extends PureComponent {	
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._updateBar();
	}

	/**
	 * Update tracker bar if our position has changed
	 *
	 * @param 	object 		prevProps 		Previous props object
	 * @return 	void
	 */
	componentDidUpdate(prevProps) {
		if( prevProps.currentPosition !== this.props.currentPosition ){
			this._updateBar();
		}
	}

	/**
	 * Calculates % and transitions bar
	 *
	 * @return 	void
	 */
	_updateBar() {
		const trackerWidth = Math.ceil( parseInt( this.props.currentPosition ) / parseInt( this.props.total ) * 100 );
		this._trackerBar.transitionTo({ width: `${trackerWidth}%` });
	}

	render() {
		if( this.props.total < 1 ){
			return null;
		}

		return (
			<ActionBar light style={{ height: 30, minHeight: 30 }}>
				<View style={componentStyles.trackerWrapper}>
					<Animatable.View ref={ref => this._trackerBar = ref} style={[componentStyles.trackerBar, { width: '0%' }]}></Animatable.View>
				</View>
				<Text style={componentStyles.trackerText}>{this.props.currentPosition} of {this.props.total}</Text>
			</ActionBar>
		);
	}
}

const componentStyles = StyleSheet.create({
	trackerWrapper: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	trackerBar: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		backgroundColor: styleVars.greys.darker
	},
	trackerActiveText: {
		color: '#fff'
	},
	trackerText: {
		fontWeight: '500',
		fontSize: styleVars.fontSizes.small,
		color: styleVars.lightText
	}
});

Pager.defaultProps = {
	currentPosition: 1,
	onChange: () => {}
};

Pager.propTypes = {
	currentPosition: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	onChange: PropTypes.func
};