import React, { Component } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

import { PlaceholderElement, PlaceholderContainer } from '../../atoms/Placeholder';
import ExpandedContentItem from './ExpandedContentItem';
import CondensedContentItem from './CondensedContentItem';
import ExpandedComment from './ExpandedComment';
import CondensedComment from './CondensedComment';
import ShadowedArea from '../../atoms/ShadowedArea';
import UserPhoto from '../../atoms/UserPhoto';
import RichTextContent from '../../atoms/RichTextContent';
import relativeTime from '../../utils/RelativeTime';
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

		// Find only https images
		/*let imageToUse;
		for( let i = 0; i < this.props.data.contentImages.length; i++ ){
			if( this.props.data.contentImages[i].indexOf('https') === 0 ){
				imageToUse = this.props.data.contentImages[i];
				break;
			}
		}*/
		let imageToUse = this.props.data.contentImages[0];

		if( !imageToUse ){
			return;
		}

		return ( <View style={componentStyles.imageContainer}>
					<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode='cover' />
				</View> );
	}

	getCardComponent() {
		let Component;

		if( !this.props.data.isComment && !this.props.data.isReview ){
			Component = this.props.view !== 'condensed' ? ExpandedContentItem : CondensedContentItem;
		} else {
			Component = this.props.view !== 'condensed' ? ExpandedComment : CondensedComment;
		}

		return Component;
	}

	render() {
		if( this.props.loading ){
			return this.loadingComponent();
		}

		const Component = this.getCardComponent();

		return (
			<TouchableHighlight style={componentStyles.postWrapper}>
				<ShadowedArea style={componentStyles.post}>
					<View style={componentStyles.blob}></View>
					<Component data={this.props.data} image={this.getContentImage()} />
				</ShadowedArea>
			</TouchableHighlight>
		);
	}
}