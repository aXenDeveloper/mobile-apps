import React, { Component } from "react";
import { Text, View, Image, FlatList, StyleSheet, TouchableHighlight } from "react-native";
import _ from "underscore";
import FadeIn from "react-native-fade-in-image";

import NavigationService from "../../utils/NavigationService";
import LargeTitle from "../../atoms/LargeTitle";
import UserPhoto from "../../atoms/UserPhoto";
import ContentCard from "../../ecosystems/ContentCard";
import getImageUrl from "../../utils/getImageUrl";
import getSuitableImage from "../../utils/getSuitableImage";
import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";

class NewContent extends Component {
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
		if (this.props.loading) {
			return (
				<ContentCard
					style={{
						width: this.props.cardWidth,
						marginLeft: styleVars.spacing.wide
					}}
					loading={this.props.loading}
				/>
			);
		}

		if (_.isArray(data)) {
			return <View>{data.map(item => this.getItemCard(item))}</View>;
		}

		const imageToUse = getImageUrl(getSuitableImage(data.contentImages || null));
		const cardPieces = {
			header: (
				<React.Fragment>
					<UserPhoto url={data.author.photo} size={20} />
					<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]} numberOfLines={1}>
						{Lang.buildActionString(data.isComment, data.isReview, data.firstCommentRequired, data.author.name, data.articleLang)}
					</Text>
				</React.Fragment>
			),
			image: imageToUse ? (
				<FadeIn style={[componentStyles.imageContainer, styles.mbStandard]} placeholderStyle={{ backgroundColor: styleVars.placeholderColors[0] }}>
					<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode="cover" />
				</FadeIn>
			) : null,
			content: (
				<React.Fragment>
					<View style={componentStyles.streamItemInfo}>
						<View style={componentStyles.streamItemInfoInner}>
							<Text style={[styles.itemTitle]} numberOfLines={1}>
								{data.title}
							</Text>
							<Text style={componentStyles.streamItemContainer} numberOfLines={1}>
								In {data.containerTitle}
							</Text>
						</View>
					</View>
					<View style={componentStyles.snippetWrapper}>
						<Text style={componentStyles.snippetText} numberOfLines={imageToUse ? 4 : 3}>
							{data.content}
						</Text>
					</View>
				</React.Fragment>
			)
		};

		return (
			<ContentCard
				style={{
					width: this.props.cardWidth,
					marginLeft: styleVars.spacing.wide,
					height: imageToUse ? 315 : 150
				}}
				key={data.indexID}
				onPress={this.getPressHandler(data.indexID, data)}
				unread={data.unread}
				header={cardPieces.header}
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
		if (_.isUndefined(this.pressHandlers[id])) {
			this.pressHandlers[id] = () => this.onPressItem(data);
		}

		return this.pressHandlers[id];
	}

	/**
	 * Build an array of items we'll show. We show one item per 'cell' if it has an image,
	 * but one on top of the other if there's no image. So in this method, we search
	 * through our available items to try and pair them up as needed.
	 *
	 * @return 	array
	 */
	getListData() {
		const doneIDs = [];
		const listData = [];
		const items = this.props.data.core.newContent.items;

		for (let i = 0; i < items.length; i++) {
			// If we've already used this item, skip it
			if (doneIDs.indexOf(items[i].indexID) !== -1) {
				continue;
			}

			// If we have an image, then we'll just show one item in this 'cell'
			if (getSuitableImage(items[i].contentImages || null)) {
				doneIDs.push(items[i].indexID);
				listData.push(items[i]);
				continue;
			}

			// No image? we'll try and show two cards in this cell.
			doneIDs.push(items[i].indexID);
			const pair = [items[i]];

			// Now find the next suitable card
			for (let x = i + 1; x < items.length; x++) {
				if (!getSuitableImage(items[x].contentImages || null)) {
					doneIDs.push(items[x].indexID);
					pair.push(items[x]);
					break;
				}
			}

			// And add our card pair to the main list
			listData.push(pair);
		}

		return listData;
	}

	/**
	 * Press event handoer
	 *
	 * @param 	object 		The item data
	 * @return 	void
	 */
	onPressItem(data) {
		NavigationService.navigate(data.url, {
			id: data.itemID,
			findComment: data.isComment ? data.objectID : null
		});
	}

	render() {
		return (
			<FlatList
				horizontal
				snapToInterval={this.props.cardWidth + styleVars.spacing.wide}
				snapToAlignment="start"
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
				style={componentStyles.feed}
				data={this.props.loading ? this.getDummyData() : this.getListData()}
				keyExtractor={item => (this.props.loading ? item.key : _.isArray(item) ? `pair_${item[0].indexID}` : item.indexID)}
				renderItem={({ item }) => this.getItemCard(item)}
			/>
		);
	}
}

export default NewContent;

const componentStyles = StyleSheet.create({
	streamMetaText: {
		fontSize: styleVars.fontSizes.small
	},
	streamMetaAction: {
		marginLeft: 5,
		letterSpacing: -0.2
	},
	streamItemInfo: {
		flexDirection: "row"
	},
	streamItemInfoInnerWithPhoto: {
		marginLeft: 9
	},
	streamItemContainer: {
		color: "#8F8F8F"
	},
	snippetWrapper: {
		flex: 1,
		marginTop: 9
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
	}
});
