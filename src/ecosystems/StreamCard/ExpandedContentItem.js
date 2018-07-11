import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

import UserPhoto from '../../atoms/UserPhoto';
import RichTextContent from '../../atoms/RichTextContent';
import relativeTime from '../../utils/RelativeTime';
import componentStyles from './styles';

export default class ExpandedContentItem extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<View style={componentStyles.streamHeader}>
					<View style={componentStyles.streamMeta}>
						<Text style={[componentStyles.streamMetaText]}>
							{this.props.data.author.name} posted a topic
						</Text>
						<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaTime]}>
							{relativeTime.short(this.props.data.updated)}
						</Text>
					</View>
					<View style={componentStyles.streamItemInfo}>
						<UserPhoto url={this.props.data.author.photo} size={36} />
						<View style={[ componentStyles.streamItemInfoInner, componentStyles.streamItemInfoInnerWithPhoto ]}>
							<Text style={componentStyles.streamItemTitle}>{this.props.data.title}</Text>
							<Text style={componentStyles.streamItemContainer}>In {this.props.data.containerTitle}</Text>
						</View>
					</View>
				</View>
				{this.props.image || null}
				<View style={componentStyles.streamFooter}>
					<Text style={componentStyles.snippetText} numberOfLines={3}>
						{this.props.data.content}
					</Text>
				</View>
			</React.Fragment>
		);
	}
}
//
//relativeTime.long(this.props.data.updated)