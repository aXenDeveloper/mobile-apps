import React, { Component } from "react";
import { Text, View, Image, StyleSheet, TouchableHighlight, TouchableOpacity, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import _ from "underscore";

import configureStore from "../../redux/configureStore";
import { setActiveCommunity } from "../../redux/actions/app";
import parseUri from "../../utils/parseUri";
import Lang from "../../utils/Lang";
import ShadowedArea from "../../atoms/ShadowedArea";
import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import styles, { styleVars } from "../../styles";

class CommunityBox extends Component {
	constructor(props) {
		super(props);
	}

	getDisplayUrl() {
		const parsedUri = parseUri(this.props.apiUrl);
		const authority = parsedUri.authority;

		// Split by . to get the subdomain
		const split = authority.split(".");

		// Don't show www in domains; remove and return if it's there.
		if (split[0] === "www") {
			split.shift();
			return split.join(".");
		}

		return authority;
	}

	render() {
		if (this.props.loading) {
			return (
				<ShadowedArea style={[componentStyles.communityBox, styles.mbStandard]}>
					<PlaceholderContainer style={[styles.flex, styles.pStandard]} onPress={this.props.onPress}>
						<PlaceholderElement width={50} height={50} left={0} top={0} />
						<PlaceholderElement width={200} height={17} left={62} top={8} />
						<PlaceholderElement width={150} height={13} left={62} top={30} />
					</PlaceholderContainer>
				</ShadowedArea>
			);
		}

		const displayUrl = this.getDisplayUrl();

		return (
			<ShadowedArea style={[componentStyles.communityBox, styles.mbStandard]}>
				<TouchableOpacity style={[styles.flex, styles.pStandard]} onPress={this.props.onPress}>
					<View style={[styles.flexRow]}>
						<View style={[styles.mrStandard, componentStyles.image]}>
							{!this.props.app.bootStatus.loaded && this.props.app.currentCommunity.apiUrl == this.props.apiUrl && (
								<View style={[styles.flex, styles.flexJustifyCenter, styles.flexAlignCenter, componentStyles.loadingWrap]}>
									<ActivityIndicator size="small" />
								</View>
							)}
						</View>
						<View style={[styles.flex, styles.flexJustifyCenter]}>
							<Text style={[styles.itemTitle]}>{this.props.name}</Text>
							<Text style={[styles.smallText, styles.lightText]}>{displayUrl}</Text>
						</View>
					</View>
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
		borderRadius: 4,
		minHeight: 74
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 4,
		backgroundColor: styleVars.greys.light
	},
	loadingWrap: {
		...StyleSheet.absoluteFillObject
	}
});
