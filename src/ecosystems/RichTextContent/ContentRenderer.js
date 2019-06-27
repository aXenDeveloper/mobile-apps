import React, { PureComponent } from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import HTML from "react-native-render-html";
import { iframe, a } from "react-native-render-html/src/HTMLRenderers";
import { compose } from "react-apollo";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import _ from "underscore";

import { openModalWebview } from "../../redux/actions/app";
import getImageUrl from "../../utils/getImageUrl";
import Lang from "../../utils/Lang";
import relativeTime from "../../utils/RelativeTime";
import Lightbox from "../Lightbox";
import { Mention, Embed } from "../RichTextContent";
import { styleVars, richTextStyles } from "../../styles";
import dom from "../../utils/DOM";
import NavigationService from "../../utils/NavigationService";

class ContentRenderer extends PureComponent {
	constructor(props) {
		super(props);
		this._lightboxedImages = {};
		this._renderers = this.renderers();
		this.state = {
			lightboxVisible: false
		};

		this.ignoreNodesFunction = this.ignoreNodesFunction.bind(this);
		this.onLinkPress = this.onLinkPress.bind(this);
		this.alterChildren = this.alterChildren.bind(this);
		this.alterData = this.alterData.bind(this);
		this.alterNode = this.alterNode.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
	}

	/**
	 * Event handler that sets state to close the lightbox
	 *
	 * @return 	void
	 */
	closeLightbox() {
		this.setState({
			lightboxVisible: false
		});
	}

	/**
	 * Alter the text of nodes. We use this to trim some whitespace, and to build a
	 * dynamic citation for quotes.
	 *
	 * @param 	object 		node 	The node to alter
	 * @return 	string
	 */
	alterData(node) {
		let { parent, data } = node;

		if (parent) {
			// Trim whitespace from P, LI
			if (parent.name === "p" || parent.name == "li") {
				return data.trim();
			}

			// Trim whitespace from citations, and add text styling
			if (parent.name === "div" && parent.attribs.class === "ipsQuote_citation") {
				return this.buildCitation(parent.parent.attribs, data.trim());
			}
		}
	}

	/**
	 * Callback to alter the children of a node
	 *
	 * @param 	object 		node 	The node to alter
	 * @return 	array
	 */
	alterChildren(node) {
		const { children, name } = node;
		// Left blank for now
		return children;
	}

	/**
	 * Callback to alter a node. This is our basic handler for transforming post contents
	 *
	 * @param 	object 		node 	The node to alter
	 * @return 	object
	 */
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

		// Remove width attribute from iframes, so that contentMaxWidth works
		if (name === "iframe") {
			delete node.attribs.width;
			return node;
		}

		if (name === "img") {
			// Fix the image SRC
			if (!_.isUndefined(node.attribs.src)) {
				node.attribs = {
					...node.attribs,
					src: getImageUrl(node.attribs.src)
				};
			}

			// Add to lightbox if this is an attachment
			if (!_.isUndefined(node.attribs["data-fileid"])) {
				this._lightboxedImages[parent.attribs.href] = true;
			}
		}

		// If this is a Text node within the citation, add the citation text styling
		if (parent && parent.attribs.class === "ipsQuote_citation") {
			node.attribs = {
				...(node.attribs || {}),
				style: styleVars.citationTextStyle
			};
			return node;
		}
	}

	/**
	 * Callback to ignore certain nodes. We use this to hide quotes if needed
	 *
	 * @param 	object 		node 	The node to alter
	 * @return 	boolean
	 */
	ignoreNodesFunction(node) {
		if (!this.props.removeQuotes) {
			return false;
		}

		if (node.name === "blockquote") {
			if (!_.isUndefined(node.attribs.class) && node.attribs.class.indexOf("ipsQuote") !== -1) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Callback to render certain tags
	 *
	 * @return 	object
	 */
	renderers() {
		return {
			br: () => null,
			iframe: (htmlAttribs, children, convertedCSSStyles, passProps) => {
				if (!_.isUndefined(htmlAttribs["data-embedcontent"])) {
					return <Embed url={htmlAttribs.src} key={htmlAttribs["data-embedid"]} />;
				}

				return iframe(htmlAttribs, children, convertedCSSStyles, passProps);
			},
			a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
				if (!_.isUndefined(htmlAttribs["data-mentionid"])) {
					return <Mention userid={parseInt(htmlAttribs["data-mentionid"])} name={passProps.rawChildren[0].data} key={passProps.key} />;
				}

				return a(htmlAttribs, children, convertedCSSStyles, passProps);
			}
		};
	}

	/**
	 * Event handler for tapping a link. If this link is an image attachment, show the lightbox
	 *
	 * @param 	object 		evt 		The event object
	 * @param 	object 		data 		Event data
	 * @param 	object 		attribs		Node atttributes
	 * @return 	void
	 */
	onLinkPress(evt, data, attribs) {
		if (!_.isUndefined(attribs.class) && attribs.class.indexOf("ipsAttachLink_image") !== -1) {
			// Trigger the lightbox
			this.setState({
				lightboxVisible: true,
				defaultImage: attribs.href
			});

			return;
		}

		NavigationService.navigate(data);
	}

	/**
	 * Build a citation for a quote
	 *
	 * @param 	object 		quoteAttribs 	The attributes obtained from the quote wrapper, containing quote data
	 * @param 	string		defaultValue 	The default value for this citation (i.e. whatever text was already there)
	 * @return 	string
	 */
	buildCitation(quoteAttribs, defaultValue) {
		let toReturn = defaultValue;

		if (!_.isUndefined(quoteAttribs["data-ipsquote-username"])) {
			if (!_.isUndefined(quoteAttribs["data-ipsquote-timestamp"])) {
				toReturn = Lang.get("editor_quote_line_with_time", {
					date: relativeTime.long(parseInt(quoteAttribs["data-ipsquote-timestamp"])),
					username: quoteAttribs["data-ipsquote-username"]
				});
			} else {
				toReturn = Lang.get("editor_quote_line", {
					username: quoteAttribs["data-ipsquote-username"]
				});
			}
		}

		return toReturn;
	}

	render() {
		return (
			<React.Fragment>
				<HTML
					renderers={this._renderers}
					containerStyle={this.props.style || {}}
					tagsStyles={richTextStyles(this.props.dark).tagStyles}
					classesStyles={richTextStyles(this.props.dark).classes}
					alterChildren={this.alterChildren}
					alterNode={this.alterNode}
					alterData={this.alterData}
					baseFontStyle={this.props.baseFontStyle || richTextStyles(this.props.dark).defaultTextStyle}
					ignoredStyles={["font-family", "letter-spacing", "line-height"]}
					html={this.props.children}
					imagesMaxWidth={parseInt(Dimensions.get("window").width) - 35}
					staticContentMaxWidth={parseInt(Dimensions.get("window").width) - 35}
					onLinkPress={this.props.onLinkPress || this.onLinkPress}
					ignoreNodesFunction={this.ignoreNodesFunction}
				/>
				<Lightbox
					animationIn="bounceIn"
					isVisible={this.state.lightboxVisible}
					data={this._lightboxedImages}
					initialImage={this.state.defaultImage || false}
					close={this.closeLightbox}
				/>
			</React.Fragment>
		);
	}
}

export default compose(connect())(ContentRenderer);
