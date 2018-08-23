import React, { Component } from "react";
import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableHighlight,
	TouchableOpacity
} from "react-native";
import FadeIn from "react-native-fade-in-image";

import Lang from "../../utils/Lang";
import {
	PlaceholderContainer,
	PlaceholderElement
} from "../../ecosystems/Placeholder";
import { styleVars } from "../../styles";

export default class ContentCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.loading) {
			return (
				<View
					style={[
						componentStyles.contentCard,
						this.props.style,
						{ height: 300 }
					]}
				>
					<PlaceholderElement circle radius={20} left={12} top={12} />
					<PlaceholderElement
						width={150}
						left={40}
						top={16}
						height={10}
					/>
					<PlaceholderElement
						width="100%"
						left={0}
						right={0}
						top={45}
						height={135}
					/>
					{this.props.image && <PlaceholderElement width={200} left={12} top={192} />}
					<PlaceholderElement
						width={150}
						left={12}
						top={215}
						height={12}
					/>
					<PlaceholderElement
						width={250}
						left={12}
						top={240}
						height={12}
					/>
					<PlaceholderElement
						width={250}
						left={12}
						top={256}
						height={12}
					/>
					<PlaceholderElement
						width={250}
						left={12}
						top={272}
						height={12}
					/>
				</View>
			);
		}

		return (
			<View style={[componentStyles.contentCard, this.props.style]}>
				<View style={[componentStyles.contentCardInner]}>
					{this.props.header && (
						<View style={componentStyles.streamHeader}>
							<View style={componentStyles.streamMeta}>
								<View style={componentStyles.streamMetaInner}>
									{this.props.header}
								</View>
							</View>
						</View>
					)}
					{this.props.image && this.props.image}
					{this.props.content && (
						<View style={[componentStyles.streamFooter]}>
							{this.props.content}
						</View>
					)}
				</View>
			</View>
		);
	}
}

const componentStyles = StyleSheet.create({
	contentCard: {
		backgroundColor: "#fff",
		shadowColor: "rgba(0,0,0,0.05)",
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 1,
		shadowRadius: 12,
		marginBottom: 15
	},
	contentCardInner: {
		borderRadius: 5,
		overflow: 'hidden',
		display: "flex",
		justifyContent: "flex-start",
	},
	streamHeader: {
		paddingHorizontal: 12,
		paddingTop: 12
	},
	streamMeta: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 12
	},
	streamMetaInner: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	streamFooter: {
		paddingHorizontal: 12,
		paddingVertical: 12
	}
});
