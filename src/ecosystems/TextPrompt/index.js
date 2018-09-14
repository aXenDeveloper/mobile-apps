import React, { Component } from "react";
import { Text, TextInput, View, StyleSheet, TouchableHighlight } from "react-native";
import Modal from "react-native-modal";

import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";

export default class TextPrompt extends Component {
	state = {
		value: ""
	};

	constructor(props) {
		super(props);
		this._input = null;
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.isVisible && this.props.isVisible) {
			this._input.focus();
		}
	}

	_onChange(value) {
		this.setState({ value });
	}

	_onSubmit() {
		this.props.submit(this.state.value);
	}

	render() {
		return (
			<Modal
				style={componentStyles.outerModal}
				isVisible={this.props.isVisible}
				avoidKeyboard
				animationIn="bounceIn"
				animationOut="fadeOut"
				onBackdropPress={() => this.props.close()}
			>
				<View style={componentStyles.modal}>
					<Text style={[componentStyles.text, componentStyles.title]}>{this.props.title}</Text>
					<Text style={[componentStyles.text, styles.lightText, componentStyles.message]}>{this.props.message}</Text>
					<TextInput
						style={componentStyles.textInput}
						onChangeText={value => this._onChange(value)}
						placeholder={this.props.placeholder}
						ref={input => (this._input = input)}
						{...this.props.textInputProps}
					/>
					<TouchableHighlight style={componentStyles.button} onPress={() => this._onSubmit()}>
						<Text>Go</Text>
					</TouchableHighlight>
				</View>
			</Modal>
		);
	}
}

const componentStyles = StyleSheet.create({
	outerModal: {
		flex: 1
	},
	modal: {
		backgroundColor: "#fff",
		padding: styleVars.spacing.wide,
		borderRadius: 6
	},
	text: {
		textAlign: "center"
	},
	title: {
		fontSize: styleVars.fontSizes.large,
		color: "#000",
		fontWeight: "bold"
	},
	message: {
		fontSize: styleVars.fontSizes.standard
	},
	textInput: {
		borderWidth: 1,
		borderColor: styleVars.borderColors.dark,
		paddingHorizontal: styleVars.spacing.standard,
		paddingVertical: styleVars.spacing.tight,
		marginTop: styleVars.spacing.wide,
		borderRadius: 3
	}
});
