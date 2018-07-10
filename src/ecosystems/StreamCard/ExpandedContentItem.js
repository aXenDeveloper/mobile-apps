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
				<View style={componentStyles.postHeader}>
					<TouchableOpacity style={componentStyles.postInfo}>
						<View style={componentStyles.postInfo}>
							
							<View style={componentStyles.meta}>
								<Text style={componentStyles.username}>{this.props.data.title}</Text>
								<Text style={componentStyles.date}>{this.props.data.author.name} posted a topic</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
				{this.props.image || null}
				<View style={componentStyles.contentItemInfo}>
					<Text style={componentStyles.containerName}>{this.props.data.containerTitle}</Text>
					<Text style={componentStyles.snippetText} numberOfLines={3}>
						{this.props.data.content}
					</Text>
				</View>
			</React.Fragment>
		);
	}
}
//<UserPhoto url={this.props.data.author.photo} size={36} />
//relativeTime.long(this.props.data.updated)