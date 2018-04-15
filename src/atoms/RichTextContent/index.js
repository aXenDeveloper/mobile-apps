import React, { Component } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import HTML from "react-native-render-html";
import { styleVars, richTextStyles } from "../../styles.js";
import dom from "../../utils/DOM";

export default class RichTextContent extends Component {
	constructor(props) {
		super(props);
	}

	alterData(node) {
		let { parent, data } = node;

		if (parent) {
			// Trim whitespace from P, LI
			if (parent.name === "p" || parent.name == "li") {
				return data.trim();
			}

			// Trim whitespace from citations, and add text styling
			if (parent.name === "div" && parent.attribs.class === "ipsQuote_citation") {
				return data.trim();
			}
		}
	}

	alterChildren(node) {
		const { children, name } = node;

		// Remove width attribute from iframes, so that contentMaxWidth works
		if (name === "iframe") {
			delete node.attribs.width;
		}

		return children;
	}

	alterNode(node) {
		const { name, parent } = node;

		// Remove bottom margin from last p. Behaves like :last-child.
		if (name === "p" && dom.isLastChild(node) ) {
			node.attribs = {
				...(node.attribs || {}),
				style: `marginBottom: 0`
			};
		// If this is a Text node within the citation, add the citation text styling
		} else if (parent && parent.attribs.class === "ipsQuote_citation") {
			node.attribs = {
				...(node.attribs || {}),
				style: styleVars.citationTextStyle
			};
		}
	}

	renderers() {
		return {
			br: () => null
		};
	}

	onLinkPress(evt, data, attribs) {
		console.log(data);
		console.log(attribs);
	}

	render() {
		console.log(this.props.children);

		return (
			<HTML
				renderers={this.renderers()}
				tagsStyles={richTextStyles.tagStyles}
				classesStyles={richTextStyles.classes}
				alterChildren={this.alterChildren}
				alterNode={this.alterNode}
				alterData={this.alterData}
				baseFontStyle={
					this.props.baseFontStyle || richTextStyles.defaultTextStyle
				}
				html={this.props.children}
				imagesMaxWidth={parseInt(Dimensions.get("window").width) - 35}
				staticContentMaxWidth={parseInt(Dimensions.get("window").width) - 35}
				onLinkPress={this.props.onLinkPress || this.onLinkPress}
			/>
		);
	}
}
