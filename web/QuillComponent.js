import Quill from "quill/dist/quill.min.js";
import "quill/dist/quill.core.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import LinkBlot from "quill/formats/link";

const BROWSER = false;
const DEBUG = false;
const REMOTE_DEBUG = true;
const MESSAGE_PREFIX = "__IPS__";

const util = require("util");
const FORMATS = ["bold", "italic", "underline", "list"];

class QuillComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quill: null,
			debug: [],
			range: {
				index: 0,
				length: 0
			}
		};
	}

	/**
	 * Component mounted
	 *
	 * @return 	void
	 */
	componentDidMount() {
		this._count = 0;
		this.waitForReady();
	}

	/**
	 * We want to allow the Native app to set the placeholder by injecting
	 * JS into this page. So we need to wait until it has indicated it is ready
	 * for our page to be initialized. If it's too slow, we'll just go anyway with a default.
	 *
	 * @return 	void
	 */
	waitForReady() {
		this._timer = setTimeout( () => {
			if( window._readyToGo || this._count == 50 ){
				this._setUpEditor();
			} else {
				this._count++;
				this.waitForReady();
			}
		}, 10);
	}

	/**
	 * Create a new instance of Quill and store it in state.
	 * Once state saves, set up our event handlers and send a READY command.
	 *
	 * @return 	void
	 */
	_setUpEditor() {
		let placeholder = "Content";

		if( window._PLACEHOLDER !== undefined ){
			placeholder = window._PLACEHOLDER;
		}

		// Set up Quill
		this.setState({
			quill: new Quill("#quill", {
				bounds: "#container",
				placeholder
			})
		}, () => {
			this.setUpEvents();
			this.sendMessage("READY");
		});
	}

	/**
	 * Make sure we remove event handlers when unmounting
	 *
	 * @return 	void
	 */
	componentWillUnmount() {
		clearTimeout( this._timer );
		document.removeEventListener("message", this.onMessage);
		window.removeEventListener("message", this.onMessage);
	}

	/**
	 * Set up our event handlers
	 *
	 * @return 	void
	 */
	setUpEvents() {
		// Add message event listener
		if (document) {
			document.addEventListener("message", this.onMessage.bind(this));
		}
		if (window) {
			window.addEventListener("message", this.onMessage.bind(this));
		}

		this.state.quill.on("selection-change", this.selectionChange.bind(this));
		this.state.quill.on("text-change", this.textChange.bind(this));
	}

	/**
	 * Event handler; handles selection changes triggered by Quill
	 *
	 * @param 	object 		range 		New range
	 * @param 	object 		oldRange	Previous range
	 * @param 	string 		source 		Where the event came from (e.g. `user`)
	 * @return 	void
	 */
	selectionChange(range, oldRange, source) {
		// If range is null, that means the editor is not focused.
		if (range === null) {
			this.sendMessage("EDITOR_BLUR");
		} else {
			// Remember our range, so that we can insert content even if we lose focus
			this.setState({
				range: {
					index: range.index,
					length: range.length
				}
			});

			const format = this.state.quill.getFormat(range);

			// If we're inside a link, get the props
			/*if( range.length === 0 && source === 'user' ){
				if (format["link"]) {
					//let [link, offset] = this.state.quill.scroll.descendant(LinkBlot, range.index);
					let [link, offset] = this.state.quill.getLeaf(range.index);

					//if( link != null ){
						let preview = LinkBlot.formats(link.domNode);
						this.addDebug("Link content: " + preview);
					//}

					this.addDebug("Within link");
				}
			}*/

			// If editor is focused, get the formatting at range and send it over
			this.sendMessage("FORMATTING", {
				formatState: format
			});
		}
	}

	/**
	 * Handles text-change event sent from Quill
	 *
	 * @return 	void
	 */
	textChange() {
		this.sendMessage("CONTENT", {
			content: this.state.quill.container.querySelector('.ql-editor').innerHTML
		});
	}

	/**
	 * Our main postMessage event handler. Receives messages from the main app,
	 * and handles them as necessary.
	 *
	 * @return 	void
	 */
	onMessage(e) {
		try {
			const messageData = JSON.parse(e.data);

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				this.addDebug(`Received event: ${messageType}`);

				switch (messageType) {
					case "SET_FORMAT":
						this.setFormat(messageData);

						// After setting the format, send the current states back to ensure correct buttons are active
						this.sendMessage("FORMATTING", {
							formatState: this.state.quill.getFormat()
						});
						break;
					case "INSERT_LINK":
						this.insertLink(messageData);
						break;
					case "FOCUS":
						this.addDebug(`Focus event`);
						setTimeout( () => {
							this.state.quill.blur();
							this.state.quill.focus();
						}, 50 );
						break;
					case "GET_CONTENT":
						this.getText(messageData);
						break;
				}
			}
		} catch (err) {
			this.addDebug(err);
		}
	}

	/**
	 * Send the current editor contents to the main app
	 *
	 * @return 	void
	 */
	getText(data) {
		this.sendMessage("CONTENT", {
			content: this.state.quill.container.querySelector('.ql-editor').innerHTML
		});
	}

	/**
	 * Inserts a link into the editor
	 *
	 * @param 	object 	data 	Link data, used to build the link
	 * @return 	void
	 */
	insertLink(data) {
		// Todo: validate link/text
		
		const range = this.state.quill.getSelection(true);
		this.addDebug(`Range index: ${range.index}, length: ${range.length}`);

		const delta = {
			ops: [
				{
					retain: range.index || 0
				},
				{
					insert: data.text,
					attributes: {
						link: data.url
					}
				}
			]
		};
		this.state.quill.updateContents(delta);
		this.state.quill.setSelection(range.index + range.length + data.text.length, 0);

		this.addDebug(`Range index: ${range.index + range.length + data.text.length}, length: 0`);

		this.setState({
			range: {
				index: range.index + range.length + data.text.length,
				length: 0
			}
		});
	}

	/**
	 * Set formatting in the document
	 *
	 * @param 	object 		data 	Object containing format 'type', and optional 'option'
	 * @return 	void
	 */
	setFormat(data) {
		this.state.quill.format(data.type, data.option || false, "user");
	}

	/**
	 * Send a message to the main app via postMessage
	 *
	 * @param 	string 		message 		The message code to send
	 * @param 	object 		data 			Object to be serialized and sent with the message
	 * @return 	void
	 */
	sendMessage(message, data = {}) {
		this.addDebug(`Sending ${message}`, false);

		const messageToSend = JSON.stringify({
			message: `${MESSAGE_PREFIX}${message}`,
			...data
		});

		if (document.hasOwnProperty("postMessage")) {
			document.postMessage(messageToSend, "*");
		} else if (window.hasOwnProperty("postMessage")) {
			window.postMessage(messageToSend, "*");
		} else {
			this.addDebug(`ERROR: unable to send message`, false);
		}
	}

	/**
	 * Debug helper
	 *
	 * @param 	object|string 		message 		Message to log
	 * @param 	boolean				sendRemotely	Send a DEBUG command to main app?
	 * @return 	void
	 */
	addDebug(message, sendRemotely = true) {
		if (DEBUG || REMOTE_DEBUG) {
			if (typeof message == "object") {
				message = util.inspect(message, { showHidden: false, depth: null });
			}

			if( DEBUG ){
				this.setState({
					debug: this.state.debug.concat(message)
				});
			}
			if( REMOTE_DEBUG && sendRemotely ){
				this.sendMessage("DEBUG", {
					debugMessage: message
				});
			}
		}
	}

	render() {
		return (
			<React.Fragment>
				<div id="container" style={{ height: DEBUG ? "50%" : "100%", display: "flex", flexDirection: "column" }}>
					<div id="quill" style={{ fontSize: "16px", height: "100%" }} />
				</div>
				{DEBUG &&
					<div style={{ overflow: "auto", height: "50%" }}>
						<strong>Debug:</strong>
						<ul>{this.state.debug.map(message => <li>{message}</li>)}</ul>
					</div>
				}
			</React.Fragment>
		);
	}
}

export default QuillComponent;
