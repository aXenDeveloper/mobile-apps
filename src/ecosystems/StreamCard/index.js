import React, { Component } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

import { PlaceholderElement, PlaceholderContainer } from '../../ecosystems/Placeholder';
import StreamItem from './StreamItem';
import StreamComment from './StreamComment';
import ShadowedArea from '../../atoms/ShadowedArea';
import UserPhoto from '../../atoms/UserPhoto';
import RichTextContent from '../../atoms/RichTextContent';
import relativeTime from '../../utils/RelativeTime';
import getSuitableImage from '../../utils/getSuitableImage';
import componentStyles from './styles';

export default class StreamCard extends Component {	
	constructor(props) {
		super(props);
	}

	//====================================================================
	// LOADING
	loadingComponent() {
		return (
			<ShadowedArea style={[ styles.post, styles.postWrapper ]}>
				<PlaceholderContainer height={40}>
					<PlaceholderElement circle radius={40} left={0} top={0} />
					<PlaceholderElement width={160} height={15} top={0} left={50} />
					<PlaceholderElement width={70} height={14} top={23} left={50} />
				</PlaceholderContainer>
				<PlaceholderContainer height={100} style={styles.postContentContainer}>
					<PlaceholderElement width='100%' height={12} />
					<PlaceholderElement width='70%' height={12} top={20} />
					<PlaceholderElement width='82%' height={12} top={40} />
					<PlaceholderElement width='97%' height={12} top={60} />
				</PlaceholderContainer>
			</ShadowedArea>
		);
	}

	getStreamMetaString() {
		// No meta string if this isn't a comment or review
		if( !this.props.data.isComment && !this.props.data.isReview ){
			return;
		}

		let didString = 'their own';
		if( this.props.data.author.id !== this.props.data.itemAuthor.id ){
			didString = `${this.props.data.itemAuthor.name}'s`;
		}

		let typeString = 'commented on';
		if( this.props.data.isReview ){
			typeString = 'reviewed';
		}

		let contentType = this.props.data.class.split('\\').pop().toLowerCase();

		return (<View style={componentStyles.metaTextWrapper}>
					<Text style={componentStyles.metaText}>{this.props.data.author.name} {typeString} {didString} {contentType}</Text>
				</View>);
	}

	getContentImage() {
		// No images in this content
		if( !this.props.data.contentImages || !this.props.data.contentImages.length ){
			return;
		}

		// Fetch an image to show
		const imageToUse = getSuitableImage( this.props.data.contentImages );
		if( !imageToUse ){
			return;
		}

		return ( <View style={componentStyles.imageContainer}>
					<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode='cover' />
				</View> );
	}

	render() {
		if( this.props.loading ){
			return this.loadingComponent();
		}

		const Component = !this.props.data.isComment && !this.props.data.isReview ? StreamItem : StreamComment;

		return (
			<TouchableHighlight style={componentStyles.postWrapper} onPress={this.props.onPress}>
				<ShadowedArea style={componentStyles.post}>
					<View style={componentStyles.blob}></View>
					<Component data={this.props.data} image={this.getContentImage()} />
				</ShadowedArea>
			</TouchableHighlight>
		);
	}
}