import React, { Component } from "react";
import { Text, Image, View, FlatList, StyleSheet, TouchableHighlight } from "react-native";
import _ from "underscore";
import FadeIn from "react-native-fade-in-image";

import NavigationService from "../../utils/NavigationService";
import LargeTitle from "../../atoms/LargeTitle";
import ContentCard from "../../ecosystems/ContentCard";
import { ReactionOverview } from "../../ecosystems/Reaction";
import getImageUrl from "../../utils/getImageUrl";
import getSuitableImage from "../../utils/getSuitableImage";
import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";

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

		const imageToUse = getImageUrl(getSuitableImage(data.images || null));
		const cardPieces = {
			image: imageToUse ? (
				<FadeIn style={[componentStyles.imageContainer, styles.mbStandard]} placeholderStyle={{ backgroundColor: styleVars.placeholderColors[1] }}>
					<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode="cover" />
				</FadeIn>
			) : (
				<View style={componentStyles.imageContainer} />
			),
			content: (
				<React.Fragment>
					<View style={componentStyles.streamItemInfo}>
						<View style={componentStyles.streamItemInfoInner}>
							<Text style={[componentStyles.streamItemTitle, componentStyles.streamItemTitleSmall]} numberOfLines={2}>
								{data.title}
							</Text>
						</View>
					</View>
					<View style={componentStyles.snippetWrapper}>
						<Text style={componentStyles.snippetText} numberOfLines={3}>
							{data.description}
						</Text>
					</View>
					{data.reputation && (Boolean(data.reputation.reactions.length) || (Boolean(data.dataCount) && Boolean(data.dataCount.count))) && (
						<View style={componentStyles.infoFooter}>
							{Boolean(data.reputation.reactions.length) && (
								<ReactionOverview style={[styles.mtTight, componentStyles.reactionOverview]} reactions={data.reputation.reactions} />
							)}
							{Boolean(data.dataCount) && Boolean(data.dataCount.count) && (
								<Text style={[componentStyles.dataCount, styles.lightText]}>{data.dataCount.words}</Text>
							)}
						</View>
					)}
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
		if (_.isUndefined(this.pressHandlers[id])) {
			this.pressHandlers[id] = () => this.onPressItem(data);
		}

		return this.pressHandlers[id];
	}

	/**
	 * Press event handoer
	 *
	 * @param 	object 		The item data
	 * @return 	void
	 */
	onPressItem(data) {
		let params;

		// Figure out if we support this type of view, based on the itemType
		// @todo support review
		if (data.itemType == "COMMENT") {
			params = {
				id: data.item.item.id,
				findComment: parseInt(data.item.id)
			};
		} else {
			params = {
				id: data.item.id
			};
		}

		NavigationService.navigate(data.itemType === "COMMENT" ? data.item.item.url : data.item.url, params);
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
				data={this.props.loading ? this.getDummyData() : this.props.data.core.ourPicks}
				keyExtractor={item => (this.props.loading ? item.key : item.id)}
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
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: styleVars.spacing.standard,
		paddingTop: styleVars.spacing.veryTight,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0"
	},
	reactionOverview: {
		marginLeft: styleVars.spacing.wide
	},
	dataCount: {
		marginTop: 6
	}
});
