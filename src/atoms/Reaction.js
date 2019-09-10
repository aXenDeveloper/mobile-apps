import React, { Component } from "react";
import { Text, View, Image, TouchableHighlight } from "react-native";

import getImageUrl from "../utils/getImageUrl";
import { withTheme } from "../themes";
import formatNumber from "../utils/formatNumber";

class Reaction extends Component {
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
	}

	/**
	 * Event handler for tapping this reaction
	 *
	 * @return 	void
	 */
	onPress() {
		this.props.onPress({
			id: this.props.id,
			reactionId: this.props.reactionId,
			count: this.props.count,
			image: this.props.image
		});
	}

	render() {
		const { componentStyles } = this.props;
		return (
			<TouchableHighlight onPress={this.props.onPress ? this.onPress : null} key={this.props.id} style={[this.props.style, componentStyles.reactionWrapper]}>
				<View style={componentStyles.reaction}>
					<Image source={{ uri: getImageUrl(this.props.image) }} style={componentStyles.reactionImage} resizeMode="cover" />
					<Text style={componentStyles.reactionCount}>{this.props.count}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const _componentStyles = {
	reactionWrapper: {
		borderRadius: 4
	},
	reaction: {
		backgroundColor: "#F0F0F0", // @todo color
		padding: 5,
		borderRadius: 4,
		flexGrow: 0,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		height: 26
	},
	reactionImage: {
		width: 16,
		height: 16
	},
	reactionCount: {
		color: "#000", // @todo color
		fontSize: 12,
		fontWeight: "bold",
		paddingLeft: 5,
		paddingRight: 5
	}
};

export default withTheme(_componentStyles)(Reaction);
