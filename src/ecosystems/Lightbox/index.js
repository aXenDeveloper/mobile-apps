import React, { Component } from "react";
import { Text, Image, View, StatusBar, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import ImageViewer from "react-native-image-zoom-viewer";
import _ from "underscore";

import Lang from "../../utils/Lang";
import getImageUrl from "../../utils/getImageUrl";
import styles, { styleVars } from "../../styles";

export default class Lightbox extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Reformat our incoming data to the format ImageViewer needs:
	 * [{ url: ... }, { url: ... }]
	 *
	 * @param 	number 		offset 		Offset to set
	 * @return 	void
	 */
	getImages() {
		return Object.keys(this.props.data).map(url => ({ url: getImageUrl(url) }));
	}

	/**
	 * Return the index of the initial image to show
	 *
	 * @return 	int
	 */
	getInitialIndex() {
		if (this.props.initialImage) {
			const index = Object.keys(this.props.data).findIndex(url => url === this.props.initialImage);

			return index < 0 ? 0 : index;
		}

		return 0;
	}

	/**
	 * Render
	 *
	 * @return 	Component
	 */
	render() {
		return (
			<Modal style={componentStyles.modal} avoidKeyboard={true} animationIn="fadeIn" isVisible={this.props.isVisible}>
				<StatusBar hidden showHideTransition="fade" />
				<ImageViewer imageUrls={this.getImages()} index={this.getInitialIndex()} enableSwipeDown onSwipeDown={() => this.props.close()} />
			</Modal>
		);
	}
}

const componentStyles = StyleSheet.create({
	modal: {
		...StyleSheet.absoluteFillObject,
		padding: 0,
		margin: 0
	}
});
