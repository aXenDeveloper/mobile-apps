import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { compose } from "react-apollo";
import { withNavigation } from "react-navigation";
import _ from "underscore";

import NavigationService from "../../utils/NavigationService";
import styles, { styleVars } from "../../styles";

class Mention extends Component {
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);

		console.log("Mention user id: " + props.userid);
	}

	onPress() {
		NavigationService.navigateToScreen("Profile", {
			id: this.props.userid,
			name: this.props.name
		});
	}

	/**
	 * Render the mention
	 *
	 * @return 	Component
	 */
	render() {
		return (
			<React.Fragment>
				<Text onPress={this.onPress} style={[componentStyles.mentionWrapper, styles.phVeryTight]}>
					<Text>{" "}</Text>
					<Text style={[componentStyles.mention, styles.smallText]}>{this.props.name}</Text>
					<Text>{" "}</Text>
				</Text>
			</React.Fragment>
		)
	}
}

export default compose(
	withNavigation
)(Mention);

const componentStyles = StyleSheet.create({
	mentionWrapper: {
		backgroundColor: styleVars.accentColor,
		borderRadius: 3,
		paddingVertical: 2
	},
	mention: {
		color: styleVars.reverseText,
		includeFontPadding: false,
		textAlignVertical: 'center'
	}
});
