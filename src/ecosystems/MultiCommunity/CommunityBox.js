import React, { Component } from "react";
import { Text, View, Image, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { setActiveCommunity } from "../../redux/actions/app";
import Lang from "../../utils/Lang";
import ShadowedArea from "../../atoms/ShadowedArea";
import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import styles, { styleVars } from "../../styles";

class CommunityBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ShadowedArea style={[componentStyles.communityBox, styles.mbWide]}>
				<TouchableOpacity style={[styles.flex, styles.flexJustifyCenter, styles.flexAlignCenter]} onPress={this.props.onPress}>
					<Text>{this.props.title}</Text>
					{this.props.app.bootStatus.loading && this.props.app.currentCommunity.apiUrl == this.props.apiUrl && <Text>Booting...</Text>}
				</TouchableOpacity>
			</ShadowedArea>
		);
	}
}

export default compose(
	connect(state => ({
		app: state.app
	}))
)(CommunityBox);

const componentStyles = StyleSheet.create({
	communityBox: {
		minHeight: 200,
		borderRadius: 4
	}
});
