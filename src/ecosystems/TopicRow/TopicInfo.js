import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableHighlight } from "react-native";

import Lang from "../../utils/Lang";
import { PlaceholderElement, PlaceholderContainer } from "../../ecosystems/Placeholder";
import TopicIcon from "../../atoms/TopicIcon";
import LockedIcon from "../../atoms/LockedIcon";
import getImageUrl from "../../utils/getImageUrl";
import getSuitableImage from "../../utils/getSuitableImage";
import styles, { styleVars } from "../../styles";

class TopicInfo extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Return a suitable thumbnail for the topic, if available
	 *
	 * @return 	Component|null
	 */
	getThumbnail() {
		const suitableImage = getSuitableImage(this.props.data.contentImages);

		if (suitableImage) {
			return <Image source={{ url: getImageUrl(suitableImage) }} resizeMode="cover" style={this.props.styles.thumbnailImage} />;
		}

		return null;
	}

	render() {
		const image = this.getThumbnail();

		return (
			<View style={[this.props.styles.topicRowInner, image !== null ? this.props.styles.topicRowInnerWithImage : null]}>
				<View style={this.props.styles.topicInfo}>
					<View style={this.props.styles.topicTitle}>
						{Boolean(this.props.data.isLocked) && <LockedIcon style={this.props.styles.lockedIcon} />}
						<Text style={[this.props.styles.topicTitleText, this.props.showAsUnread ? styles.title : styles.titleRead]} numberOfLines={2}>
							{this.props.data.title}
						</Text>
					</View>
					<Text style={[this.props.styles.topicSnippet, this.props.showAsUnread ? styles.text : styles.textRead]} numberOfLines={1}>
						{this.props.data.snippet}
					</Text>
				</View>
				<View style={this.props.styles.thumbnail}>{image}</View>
			</View>
		);
	}
}

export default TopicInfo;
