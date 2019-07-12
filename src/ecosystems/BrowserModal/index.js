import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Modal from "react-native-modal";
import { compose } from "react-apollo";
import { connect } from "react-redux";
import _ from "underscore";

import { closeModalWebview } from "../../redux/actions/app";
import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";
import icons from "../../icons";

class BrowserModal extends Component {
	constructor(props) {
		super(props);
		this.closeModal = this.closeModal.bind(this);
	}

	closeModal() {
		this.props.dispatch(closeModalWebview());
	}

	render() {
		return (
			<Modal style={[styles.modal, styles.flex, styles.modalAlignBottom, componentStyles.modal]} isVisible={this.props.app.webview.active}>
				<View style={[styles.modalInner, styles.flex]}>
					<View style={componentStyles.browserToolbar}>
						<Text>Toolbar</Text>
					</View>
					<View style={[styles.flex]}>
						<WebView source={{ uri: this.props.app.webview.url }} style={{ flex: 1 }} />
					</View>
				</View>
			</Modal>
		);
	}
}

export default compose(
	connect(state => ({
		app: state.app
	}))
)(BrowserModal);

const componentStyles = StyleSheet.create({
	modal: {
		padding: 0,
		marginHorizontal: 0,
		marginBottom: 0,
		marginTop: 60
	},
	browserToolbar: {
		height: 60
	}
});
