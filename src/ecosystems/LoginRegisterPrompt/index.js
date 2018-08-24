import React, { Component } from 'react';
import { Text, Image, View, Animated, Easing, TouchableOpacity, StyleSheet } from 'react-native';

import ShadowedArea from "../../atoms/ShadowedArea";
import Button from "../../atoms/Button";
import styles, { styleVars } from '../../styles';

export default class LoginRegisterPrompt extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			hiding: false
		};
		this._origHeight = 0;
		this._wrapper = null;
		this._animatedValue = new Animated.Value(1);
	}

	/**
	 * Handles tapping the X to close the prompt
	 * Starts the animation that'll move it off screen
	 * Also stores a flag in local storage so we don't show it again for some period of time
	 *
	 * @return 	void
	 */
	closeLoginBox() {
		this._animation = Animated.timing(
			this._animatedValue,
			{
				toValue: 0,
				duration: 350,
				easing: Easing.bezier(0.42,0,1,1)
			}
		);

		this.setState({
			hiding: true
		});

		this._animation.start();


	}

	/**
	 * Event handler for the wrapper's onLayout callback
	 * We use this to capture the wrapper's height, which is later used in animation
	 *
	 * @param 	object 		e 		Event object
	 * @return 	void
	 */
	_onWrapperLayout(e) {
		this._origHeight = e.nativeEvent.layout.height;
	}

	/**
	 * Render
	 *
	 * @return 	Component
	 */
	render() {
		const height = this._animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0, this._origHeight]
		});
		const opacity = this._animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0.5, 1]
		});

		if( height === 0 ){
			return null;
		}

		return (
			<ShadowedArea style={[styles.row, this.props.style]} onLayout={(e) => this._onWrapperLayout(e)}>
				<Animated.View style={[componentStyles.outerWrapper, this.state.hiding ? { height, opacity } : null]}>
					<View style={[ componentStyles.innerWrapper, this.state.hiding ? { position: 'absolute', left: 0, right: 0, bottom: 0 } : null ]}>
						<View style={[ componentStyles.loginBox, this.props.closable ? componentStyles.loginBoxClosable : null ]}>
							<Image source={require("../../../resources/register_prompt.png")} style={componentStyles.loginIcon} resizeMode='contain' />
							<View style={componentStyles.loginInner}>
								<Text style={componentStyles.loginText}>{this.props.message}</Text>
							</View>
							{this.props.closable &&
								<TouchableOpacity onPress={() => this.closeLoginBox()} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
									<Image source={require("../../../resources/close.png")} style={componentStyles.closeButton} />
								</TouchableOpacity>}
						</View>
						<View style={componentStyles.buttonBar}>
							<Button title='Register' style={[componentStyles.button, styles.mrTight]} /> 
							<Button title='Sign In' style={[componentStyles.button, this.props.register ? styles.mlTight : null]} />
						</View>
					</View>
				</Animated.View>
			</ShadowedArea>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
				
	},
	outerWrapper: {
		overflow: 'hidden',
	},
	innerWrapper: {
		paddingHorizontal: styleVars.spacing.wide,
		paddingVertical: styleVars.spacing.wide,
	},
	loginBox: {		
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	loginBoxClosable: {
		paddingRight: 20
	},
	loginInner: {
		paddingLeft: styleVars.spacing.wide,
		flexBasis: 0,
		flexGrow: 1,
	},
	loginText: {
		fontSize: styleVars.fontSizes.standard
	},
	loginIcon: {
		width: 40, 
		height: 40 
	},
	closeButton: {
		width: 20,
		height: 20,
		position: 'absolute',
		right: -20,
		top: 0
	},
	buttonBar: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: styleVars.spacing.standard
	},
	button: {
		flexBasis: 0,
		flexGrow: 1
	}
});