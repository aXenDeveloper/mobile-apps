import React, { Component } from "react";
import {
	Text,
	View,
	Image,
	FlatList,
	StyleSheet,
	TouchableHighlight
} from "react-native";
import _ from "underscore";
import FadeIn from 'react-native-fade-in-image';

import LargeTitle from "../../atoms/LargeTitle";
import UserPhoto from "../../atoms/UserPhoto";
import ContentCard from "../../ecosystems/ContentCard";
import getSuitableImage from "../../utils/getSuitableImage";
import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";

class NewContent extends Component {
	constructor(props) {
		super(props);
	}

	getDummyData() {
		return _.range(5).map(idx => ({ key: idx.toString() }));
	}

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

		const imageToUse = getSuitableImage( data.contentImages || null );
		const cardPieces = {
			header: (
				<React.Fragment>
					<UserPhoto url={data.author.photo} size={20} />
					<Text style={[componentStyles.streamMetaText, componentStyles.streamMetaAction]} numberOfLines={1}>
						{Lang.buildStreamActionString( data )}
					</Text>
				</React.Fragment>
			),
			image: (
				imageToUse ?
					<FadeIn style={componentStyles.imageContainer} placeholderStyle={{ backgroundColor: styleVars.placeholderColors[0] }}>
						<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode='cover' />
					</FadeIn>
				: <View style={componentStyles.imageContainer}></View>
			),
			content: (
				<React.Fragment>
					<View style={componentStyles.streamItemInfo}>
						<View style={componentStyles.streamItemInfoInner}>
							<Text style={[ componentStyles.streamItemTitle, componentStyles.streamItemTitleSmall ]} numberOfLines={1}>{data.title}</Text>
							<Text style={componentStyles.streamItemContainer} numberOfLines={1}>In {data.containerTitle}</Text>
						</View>
					</View>
					<View style={componentStyles.snippetWrapper}>
						<Text style={componentStyles.snippetText} numberOfLines={3}>
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
					marginLeft: styleVars.spacing.wide
				}}
				header={cardPieces.header}
				image={cardPieces.image}
				content={cardPieces.content}
			/>
		);
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
						: this.props.data.core.newContent.items
				}
				keyExtractor={item => this.props.loading ? item.key : item.indexID}
				renderItem={({ item }) => this.getItemCard(item)}
			/>
		);
	}
}

export default NewContent;

const componentStyles = StyleSheet.create({	
	streamMetaText: {
		fontSize: 13
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
		fontSize: 17,
		fontWeight: "600",
		color: "#171717"
	},
	streamItemTitleSmall: {
		fontSize: 15
	},
	streamItemContainer: {
		color: "#8F8F8F"
	},
	snippetWrapper: {
		marginTop: 9
	},
	snippetText: {
		fontSize: 14
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
