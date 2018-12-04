import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import _ from "underscore";

import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

class PollModal extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal style={[styles.modal, componentStyles.modal]} swipeDirection="down" onSwipe={this.props.close} isVisible={this.props.isVisible}>
				<View style={[styles.modalInner]}>
					<View style={styles.modalHeader}>
						<Text>title</Text>
					</View>
					<View style={styles.flex}>
						<Text>content</Text>
					</View>
				</View>
			</Modal>
		);
	}
}

export default PollModal;

const componentStyles = StyleSheet.create({
	modal: {
		marginTop: 80,
		marginBottom: 80
	}
});