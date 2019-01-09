import React, { PureComponent } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";

import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

export default class BestAnswer extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {

		if( this.props.setBestAnswer == null ){
			return (
				<View style={[componentStyles.wrapper, componentStyles.bestAnswer]}>
					<Image source={icons.CHECKMARK} resizeMode='contain' style={[componentStyles.bestAnswerIcon, componentStyles.bestAnswerIconActive]} />
				</View>
			);
		}

		return (
			<TouchableOpacity onPress={this.props.setBestAnswer} style={[componentStyles.wrapper, this.props.isBestAnswer ? componentStyles.bestAnswer : null]}>
				<Image source={icons.CHECKMARK} resizeMode='contain' style={[componentStyles.bestAnswerIcon, this.props.isBestAnswer ? componentStyles.bestAnswerIconActive : null]} />
			</TouchableOpacity>
		);
	}
}

const componentStyles = StyleSheet.create({
	wrapper: {
		width: 34,
		height: 34,
		borderRadius: 34,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: styleVars.veryLightText
	},
	bestAnswer: {
		backgroundColor: styleVars.positive,
		borderColor: 'transparent'
	},
	bestAnswerIcon: {
		width: 18,
		height: 18,
		tintColor: styleVars.veryLightText
	},
	bestAnswerIconActive: {
		tintColor: '#fff'
	}
});
