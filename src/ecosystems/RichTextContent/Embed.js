import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { withNavigation } from "react-navigation";
import FadeIn from "react-native-fade-in-image";
import _ from "underscore";

import { PlaceholderContainer, PlaceholderElement } from "../../ecosystems/Placeholder";
import Lang from "../../utils/Lang";
import relativeTime from "../../utils/RelativeTime";
import { isSupportedUrl } from "../../utils/isSupportedType";
import getSuitableImage from "../../utils/getSuitableImage";
import styles, { styleVars } from "../../styles";

const ItemFragment = gql`
	fragment ItemFragment on core_Item {
		id
		title
		author {
			name
		}
		url {
			app
			module
			controller
			full
		}
		firstCommentRequired
		contentImages
		content(stripped: true, singleLine: true, truncateLength: 100)
		articleLang {
			indefinite
			definite
		}
	}
`;

const CommentFragment = gql`
	fragment CommentFragment on core_Comment {
		id
		timestamp
		content(stripped: true, singleLine: true, truncateLength: 100)
		author {
			name
		}
		url {
			app
			module
			controller
			full
		}
		item {
			...ItemFragment
		}
	}
`;

const EmbedQuery = gql`
	query EmbedQuery($url: String!) {
		core {
			content(url: $url) {
				__typename
				... on core_Item {
					...ItemFragment
				}
				... on core_Comment {
					...CommentFragment
				}
			}
		}
	}
	${ItemFragment}
	${CommentFragment}
`;

class Embed extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * Event handler for tapping on the embed to navigate
	 *
	 * @return 	void
	 */
	onPressEmbed() {
		// Get the correct data (item or comment)
		const data = this._getNormalizedData();
		const isSupported = isSupportedUrl([data.primary.url.app, data.primary.url.module, data.primary.url.controller]);

		if (isSupported) {
			this.props.navigation.navigate({
				routeName: isSupported,
				params: {
					id: data.item.id,
					findComment: data.comment !== null ? data.comment.id : null
				},
				key: isSupported + data.item.id // We could be redirecting to the same route we're already on, so make sure it's unique
			});
		} else {
			this.props.navigation.navigate("WebView", {
				url: data.primary.url.full
			});
		}
	}

	_getNormalizedData() {
		const data = {
			comment: null,
			review: null,
			item: null,
			primary: null
		};

		if (this.props.data.core.content["__typename"] == "core_Comment") {
			data.comment = this.props.data.core.content;
			data.primary = data.comment;
			data.item = data.comment.item;
		} else if (this.props.data.core.content["__typename"] == "core_Item") {
			data.item = this.props.data.core.content;
			data.primary = data.item;
		}

		return data;
	}

	/**
	 * Renders the embed content once we have our data available in this.props.data
	 *
	 * @return 	Component
	 */
	getEmbedContents() {
		// Normalize the data
		const data = this._getNormalizedData();

		const imageToUse = getSuitableImage(data.item.contentImages);
		const langString = Lang.buildActionString(
			data.comment !== null,
			data.review !== null,
			data.item.firstCommentRequired,
			data.primary.author.name,
			data.item.articleLang
		);

		return (
			<React.Fragment>
				{Boolean(imageToUse) && (
					<FadeIn style={componentStyles.imageContainer} placeholderStyle={{ backgroundColor: styleVars.placeholderColors[0] }}>
						<Image style={componentStyles.image} source={{ uri: imageToUse }} resizeMode="cover" />
					</FadeIn>
				)}
				<View style={componentStyles.body}>
					<Text style={componentStyles.metaText}>{langString}</Text>
					<Text style={componentStyles.title} numberOfLines={1}>
						{data.item.title}
					</Text>
					<Text style={componentStyles.bodyText} numberOfLines={1}>
						{data.primary.content}
					</Text>
				</View>
			</React.Fragment>
		);
	}

	/**
	 * Render the embed w/loading or error states if needed
	 *
	 * @return 	Component
	 */
	render() {
		if (this.props.data.loading) {
			return (
				<View style={[componentStyles.wrapper, this.props.style, { height: 90 }]}>
					<PlaceholderElement width={75} left={0} top={0} height={90} />
					<PlaceholderElement width="50%" left={87} top={12} height={12} />
					<PlaceholderElement width="30%" left={87} top={35} height={12} />
				</View>
			);
		} else if (this.props.data.error || _.isNull(this.props.data.core.content)) {
			console.log(this.props.data);

			return (
				<View style={[componentStyles.wrapper, componentStyles.error]}>
					<View style={componentStyles.innerWrapper}>
						<View style={componentStyles.imageContainer}>
							<Image source={require("../../../resources/error.png")} style={componentStyles.errorIcon} />
						</View>
						<View style={[componentStyles.body, componentStyles.errorBody]}>
							<Text style={componentStyles.errorText}>Sorry, we can't load this content.</Text>
						</View>
					</View>
				</View>
			);
		} else {
			return (
				<TouchableOpacity style={componentStyles.wrapper} onPress={() => this.onPressEmbed()}>
					<View style={componentStyles.innerWrapper}>{this.getEmbedContents()}</View>
				</TouchableOpacity>
			);
		}
	}
}

export default compose(
	graphql(EmbedQuery, {
		options: props => ({
			variables: {
				url: props.url
			}
		})
	}),
	withNavigation
)(Embed);

const componentStyles = StyleSheet.create({
	wrapper: {
		backgroundColor: "#fff",
		borderRadius: 4,
		borderWidth: 1,
		borderColor: styleVars.borderColors.light,
		height: 90,
		marginBottom: styleVars.spacing.standard,
		shadowColor: "rgba(0,0,0,0.05)",
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 1,
		shadowRadius: 12
	},
	innerWrapper: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 4,
		overflow: "hidden",
		display: "flex",
		flexDirection: "row"
	},
	imageContainer: {
		width: 75,
		height: "100%",
		backgroundColor: "#f0f0f0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	image: {
		...StyleSheet.absoluteFillObject
	},
	body: {
		padding: styleVars.spacing.standard,
		flexBasis: 0,
		flexGrow: 1
	},
	bodyText: {
		fontSize: styleVars.fontSizes.standard,
		marginTop: 2,
		opacity: 0.8
	},
	metaText: {
		fontSize: styleVars.fontSizes.small,
		color: styleVars.lightText,
		marginBottom: styleVars.spacing.tight
	},
	title: {
		fontSize: styleVars.fontSizes.content,
		fontWeight: "600",
		color: "#171717",
		opacity: 0.9
	},
	error: {
		height: 70
	},
	errorBody: {
		display: "flex",
		justifyContent: "center"
	},
	errorIcon: {
		width: 25,
		height: 25,
		tintColor: styleVars.veryLightText
	},
	errorText: {
		fontSize: styleVars.fontSizes.content,
		color: styleVars.veryLightText,
		alignSelf: "center"
	}
});
