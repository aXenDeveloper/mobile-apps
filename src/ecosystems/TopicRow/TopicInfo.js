import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableHighlight } from "react-native";

import LockedIcon from "../../atoms/LockedIcon";
import getImageUrl from "../../utils/getImageUrl";
import getSuitableImage from "../../utils/getSuitableImage";
import styles from "../../styles";
import CategoryName from "../../atoms/CategoryName";

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
		return (
			<View style={[this.props.styles.topicRowInner]}>
				<View style={this.props.styles.topicInfo}>
					{this.props.showCategory && (
						<CategoryName name={this.props.data.forum.name} showColor color={this.props.data.forum.featureColor} />
					)}
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
			</View>
		);
	}
}

//<View style={this.props.styles.thumbnail}>{image}</View>

export default TopicInfo;
