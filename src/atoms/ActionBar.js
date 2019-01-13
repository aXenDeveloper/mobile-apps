import React, { PureComponent } from 'react';
import { Text, View, Button, StyleSheet, TouchableHighlight } from 'react-native';

import styles, { styleVars } from "../styles";

export default class ActionBar extends PureComponent {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if( this.props.onRef && this._wrapperRef ){
			this.props.onRef( this._wrapperRef );
		}
	}

	render() {
		return (
			<View style={[ componentStyles.pager, this.props.light ? componentStyles.light : componentStyles.dark, this.props.style ]} ref={ref => this._wrapperRef = ref}>
				{this.props.children}
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	pager: {
		height: 45,
		minHeight: 45,
		padding: 7,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	dark: {
		backgroundColor: '#37454B',
	},
	light: {
		backgroundColor: styleVars.greys.medium,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.1)'
	}
});