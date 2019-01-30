import React, { Component } from 'react';
import { Text, Image, View, FlatList, StyleSheet, TouchableHighlight } from 'react-native';
import _ from "underscore";
import FadeIn from 'react-native-fade-in-image';

import LargeTitle from "../../atoms/LargeTitle";
import ContentCard from "../../ecosystems/ContentCard";
import { ReactionOverview } from "../../ecosystems/Reaction";
import getSuitableImage from "../../utils/getSuitableImage";
import { isSupportedUrl } from "../../utils/isSupportedType";
import Lang from "../../utils/Lang";
import styles, { styleVars } from '../../styles';

class OurPicks extends Component {	
	constructor(props) {
		super(props);
		this.pressHandlers = {};
	}

	getDummyData() {
		return _.range(5).map(idx => ({ key: idx.toString() }));
	}

	/**
	 * Build and return the card component for the given data
	 *
	 * @param 	object 		data 		The item data
	 * @return 	Component
	 */
	getItemCard(data) {
		if( this.props.loading ){
			return (
				<ContentCard
					style={{
						width: this.props.cardWidth,
						marginLeft: styleVars.spacing.wide
					}}
					loading={this.props.loading}
				/>
			)
		}

		const imageToUse = getSuitableImage( data.images || null );
		const cardPieces = {
			image: (
				imageToUse ?
					<FadeIn style={[componentStyles.imageContainer, styles.mbStandard]} placeholderStyle={{ backgroundColor: styleVars.placeholderColors[1] }}>
						<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode='cover' />
					</FadeIn>
				: <View style={componentStyles.imageContainer}></View>
			),
			content: (
				<React.Fragment>
					<View style={componentStyles.streamItemInfo}>
						<View style={componentStyles.streamItemInfoInner}>
							<Text style={[ componentStyles.streamItemTitle, componentStyles.streamItemTitleSmall ]} numberOfLines={1}>{data.title}</Text>
						</View>
					</View>
					<View style={componentStyles.snippetWrapper}>
						<Text style={componentStyles.snippetText} numberOfLines={3}>
							{data.description}
						</Text>
					</View>
					{(data.reputation && ( data.reputation.reactions.length || ( data.dataCount && data.dataCount.count ) ) ) &&
						<View style={componentStyles.infoFooter}>
							{data.reputation.reactions.length && <ReactionOverview style={[styles.mtTight, componentStyles.reactionOverview]} reactions={data.reputation.reactions} />}
							{data.dataCount && data.dataCount.count && <Text style={[componentStyles.dataCount, styles.lightText]}>{data.dataCount.words}</Text>}
						</View>
					}
				</React.Fragment>
			)
		};

		return (
			<ContentCard
				style={{
					width: this.props.cardWidth,
					marginLeft: styleVars.spacing.wide
				}}
				onPress={this.getPressHandler(data.id, data)}
				image={cardPieces.image}
				content={cardPieces.content}
			/>
		);
	}

	/**
	 * Memoization function that returns a press handler for an item
	 *
	 * @param 	int 	id 		ID of item to be fetched
	 * @param 	object	data 	Card data to be passed into handler
	 * @return 	function
	 */
	getPressHandler(id, data) {
		if( _.isUndefined( this.pressHandlers[ id ] ) ){
			this.pressHandlers[ id ] = () => this.onPressItem(data);
		}

		return this.pressHandlers[ id ];
	}

	/**
	 * Press event handoer
	 *
	 * @param 	object 		The item data
	 * @return 	void
	 */
	onPressItem(data) {
		let isSupported;
		let navigateParams = {
			url: data.url.full
		};

		// Figure out if we support this type of view, based on the itemType
		if( data.itemType == 'COMMENT' ){
			isSupported = isSupportedUrl([ data.item.item.url.app, data.item.item.url.module, data.item.item.url.controller ]);
			navigateParams = {
				id: data.item.item.id,
				findComment: parseInt( data.item.id )
			};
		} else if( data.itemType == 'ITEM' ){
			isSupported = isSupportedUrl([ data.item.url.app, data.item.url.module, data.item.url.controller ]);
			navigateParams = {
				id: data.item.id
			};
		} else {
			isSupported = isSupportedUrl([ data.item.url.app, data.item.url.module, data.item.url.controller ]);
			navigateParams = {
				id: data.item.id
			};
		}
		
		// Now redirect to it
		if( isSupported ){
			this.props.navigation.navigate( isSupported, navigateParams);
		} else {
			this.props.navigation.navigate("WebView", navigateParams);
		}
	}

	render() {
		return (
			<FlatList
				horizontal
				snapToInterval={
					this.props.cardWidth + styleVars.spacing.wide
				}
				snapToAlignment="start"
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
				style={componentStyles.feed}
				data={
					this.props.loading
						? this.getDummyData()
						: this.props.data.core.ourPicks
				}
				keyExtractor={item => this.props.loading ? item.key : item.id}
				renderItem={({ item }) => this.getItemCard(item)}
			/>		
		);
	}
}

export default OurPicks;

const componentStyles = StyleSheet.create({
	streamMetaText: {
		fontSize: styleVars.fontSizes.small
	},
	streamMetaAction: {
		marginLeft: 5,
		letterSpacing: -0.2
	},
	streamItemInfo: {
		flex: 1,
		flexDirection: "row"
	},
	streamItemInfoInnerWithPhoto: {
		marginLeft: 9
	},
	streamItemTitle: {
		fontSize: styleVars.fontSizes.large,
		fontWeight: "600",
		color: "#171717"
	},
	streamItemTitleSmall: {
		fontSize: styleVars.fontSizes.large
	},
	streamItemContainer: {
		color: "#8F8F8F"
	},
	snippetWrapper: {
		marginTop: 9,
		flexGrow: 1
	},
	snippetText: {
		fontSize: styleVars.fontSizes.standard,
		lineHeight: styleVars.lineHeight.standard
	},
	imageContainer: {
		height: 135,
		width: "100%",
		backgroundColor: "#333"
	},
	image: {
		flex: 1,
		width: "100%"
	},
	infoFooter: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: styleVars.spacing.standard,
		paddingTop: styleVars.spacing.veryTight,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
	},
	reactionOverview: {
		marginLeft: styleVars.spacing.wide,
	},
	dataCount: {
		marginTop: 6
	}
});