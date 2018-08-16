import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import FadeIn from 'react-native-fade-in-image';

import UserPhoto from '../../atoms/UserPhoto';
import RichTextContent from '../../atoms/RichTextContent';
import relativeTime from '../../utils/RelativeTime';
import getSuitableImage from '../../utils/getSuitableImage';
import { PlaceholderContainer, PlaceholderElement } from '../../ecosystems/Placeholder';
import { styleVars } from '../../styles';

export default class ContentCard extends Component {	
	constructor(props) {
		super(props);
	}

	getContentImage() {
		// No images in this content
		if( !this.props.data.contentImages || !this.props.data.contentImages.length ){
			return <View style={componentStyles.imageContainer}></View>;
		}

		// Fetch an image to show
		const imageToUse = getSuitableImage( this.props.data.contentImages );
		if( !imageToUse ){
			return <View style={componentStyles.imageContainer}></View>;
		}

		return ( 	<FadeIn style={componentStyles.imageContainer} placeholderStyle={{ backgroundColor: styleVars.placeholderColors[0] }}>
						<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode='cover' />
					</FadeIn>
				);
	}

	render() {
		if( this.props.loading ){
			return (
				<View style={[ componentStyles.contentCard, this.props.style, { height: 300 } ]}>
					<PlaceholderElement circle radius={20} left={12} top={12} />
					<PlaceholderElement width={150} left={40} top={16} height={10} />
					<PlaceholderElement width='100%' left={0} right={0} top={45} height={135} />
					<PlaceholderElement width={200} left={12} top={192} />
					<PlaceholderElement width={150} left={12} top={215} height={12} />
					<PlaceholderElement width={250} left={12} top={240} height={12} />
					<PlaceholderElement width={250} left={12} top={256} height={12} />
					<PlaceholderElement width={250} left={12} top={272} height={12} />
				</View>
			);
		}

		return (
			<View style={[ componentStyles.contentCard, this.props.style ]}>
				<View style={componentStyles.streamHeader}>
					<View style={componentStyles.streamMeta}>
						<View style={componentStyles.streamMetaInner}>
							<UserPhoto url={this.props.data.author.photo} size={20} />
							<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]} numberOfLines={1}>
								{this.props.data.author.name} replied to a topic
							</Text>
						</View>
					</View>
				</View>
				{this.getContentImage()}
				<View style={[componentStyles.streamFooter]}>
					<View style={componentStyles.streamItemInfo}>
						<View style={componentStyles.streamItemInfoInner}>
							<Text style={[ componentStyles.streamItemTitle, componentStyles.streamItemTitleSmall ]} numberOfLines={1}>{this.props.data.title}</Text>
							<Text style={componentStyles.streamItemContainer} numberOfLines={1}>In {this.props.data.containerTitle}</Text>
						</View>
					</View>
					<View style={componentStyles.snippetWrapper}>
						<Text style={componentStyles.snippetText} numberOfLines={3}>
							{this.props.data.content}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	contentCard: {
		backgroundColor: '#fff',
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'flex-start',
		shadowColor: 'rgba(0,0,0,0.05)',
		shadowOffset: {
			width: 0,
			height: 12
		},
		shadowOpacity: 1,
		shadowRadius: 12
	},
	streamHeader: {
		/*flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',*/
		paddingHorizontal: 12,
		paddingTop: 12
	},
	streamHeaderInner: {
		flex: 1
	},
	streamMeta: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 12
		/*borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		paddingBottom: 9,*/
	},
	streamMetaInner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	streamMetaText: {
		fontSize: 13,
	},
	streamMetaTime: {
		color: '#8F8F8F'
	},
	streamMetaAction: {
		marginLeft: 5,
		letterSpacing: -0.2
	},
	streamItemInfo: {
		flex: 1,
		flexDirection: 'row',
	},
	streamItemInfoInnerWithPhoto: {
		marginLeft: 9
	},
	streamItemTitle: {
		fontSize: 17,
		fontWeight: "600",
		color: '#171717',
	},
	streamItemTitleSmall: {
		fontSize: 15
	},
	streamItemContainer: {
		color: '#8F8F8F',
	},
	streamFooter: {
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
	streamFooterIndented: {
		borderLeftWidth: 3,
		borderLeftColor: '#f0f0f0',
		paddingLeft: 12,
		paddingBottom: 0,
		marginBottom: 12,
		marginLeft: 12
	},
	snippetWrapper: {
		marginTop: 9
	},
	snippetText: {
		fontSize: 15
	},
	blob: {
		backgroundColor: '#888',
		width: 11,
		height: 11,
		borderRadius: 11,
		position: 'absolute',
		left: -22,
		top: 9
	},
	imageContainer: {
		height: 135,
		width: '100%',
		backgroundColor: '#333'
	},
	image: {
		flex: 1,
		width: '100%'
	},

	// ============
	metaTextWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7',
		padding: 9
	},
	metaText: {
		fontSize: 13,
	},
	
	
	postWrapper: {
		marginBottom: 7
	},
	post: {
		paddingBottom: 0
	},
	
	postInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		flex: 1
	},
	meta: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		//marginLeft: 9
	},
	
	date: {
		fontSize: 14,
		color: '#8F8F8F'
	},
	postContentContainer: {
		marginTop: 16
	},
	postContent: {
		fontSize: 16
	},
	postMenu: {
		width: 24,
		height: 24
	},
	postInfoButton: {
		alignSelf: 'flex-start',
	},
	postReactionList: {
		display: 'flex',
		justifyContent: 'flex-end',
		flexWrap: 'wrap',
		flexDirection: 'row',
		marginTop: 15
	},
	reactionItem: {
		marginLeft: 10
	}
});