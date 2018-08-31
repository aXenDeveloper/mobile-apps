import React, { Component } from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import HTML from "react-native-render-html";
import _ from "underscore";

import Lightbox from "../ecosystems/Lightbox";
import Embed from "../ecosystems/Embed";
import { styleVars, richTextStyles } from "../styles";
import dom from "../utils/DOM";

export default class RichTextContent extends Component {
	constructor(props) {
		super(props);
		this._lightboxedImages = {};
		this.state = {
			lightboxVisible: false
		};
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
		if (name === "p" && dom.isLastChild(node)) {
			node.attribs = {
				...(node.attribs || {}),
				style: `marginBottom: 0`
			};
			return node;
		}

		// If this is a Text node within the citation, add the citation text styling
		if (parent && parent.attribs.class === "ipsQuote_citation") {
			node.attribs = {
				...(node.attribs || {}),
				style: styleVars.citationTextStyle
			};
			return node;
		}

		if (name === "img" && !_.isUndefined(node.attribs["data-fileid"])) {
			this._lightboxedImages[parent.attribs.href] = true;
		}
	}

	renderers() {
		return {
			br: () => null,
			iframe: ({ ...attribs }) => {
				if (!_.isUndefined(attribs["data-embedcontent"])) {
					return <Embed url={attribs.src} key={attribs["data-embedid"]} />;
				}
			}
			/*a: (attribs, children) => {
				// Track images that should be lightboxed so we can access them in our onLinkPress handler
				// @todo This may need to be modified to account for lazy-loaded images
				//console.log( attribs );
				//console.log( children );
				if( !_.isUndefined( attribs.class ) && attribs.class.indexOf('ipsAttachLink_image') !== -1 ) {
					this._lightboxedImages[ attribs.href ] = true;
					console.log( this._lightboxedImages );
				}
			}*/
		};
	}

	onLinkPress(evt, data, attribs) {
		if (!_.isUndefined(attribs.class) && attribs.class.indexOf("ipsAttachLink_image") !== -1) {
			// Trigger the lightbox
			this.setState({
				lightboxVisible: true,
				defaultImage: attribs.href
			});

			return;
		}
	}

	render() {
		//console.log(this.props.children);

		return (
			<React.Fragment>
				<HTML
					renderers={this.renderers()}
					containerStyle={this.props.style || {}}
					tagsStyles={richTextStyles(this.props.dark).tagStyles}
					classesStyles={richTextStyles(this.props.dark).classes}
					alterChildren={this.alterChildren.bind(this)}
					alterNode={this.alterNode.bind(this)}
					alterData={this.alterData.bind(this)}
					baseFontStyle={this.props.baseFontStyle || richTextStyles(this.props.dark).defaultTextStyle}
					html={this.props.children}
					imagesMaxWidth={parseInt(Dimensions.get("window").width) - 35}
					staticContentMaxWidth={parseInt(Dimensions.get("window").width) - 35}
					onLinkPress={this.props.onLinkPress || this.onLinkPress.bind(this)}
				/>
				<Lightbox
					animationIn="bounceIn"
					isVisible={this.state.lightboxVisible}
					data={this._lightboxedImages}
					initialImage={this.state.defaultImage || false}
					close={() => this.setState({ lightboxVisible: false })}
				/>
			</React.Fragment>
		);
	}
}
