import Quill from "quill/dist/quill.min.js";
import "quill/dist/quill.core.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";

const BROWSER = false;
const DEBUG = true;
const MESSAGE_PREFIX = "__IPS__";

const util = require('util');
const FORMATS = ['bold', 'italic', 'underline', 'list'];

class QuillComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quill: null,
			debug: []
		};
	}

	componentDidMount() {
		// Set up Quill
		this.setState(
			{
				quill: new Quill("#quill", {
					bounds: "#container",
					placeholder: "Content"
				})
			},
			() => {
				this.setUpEvents();
			}
		);
	}

	componentWillUnmount() {
		window.removeEventListener("message", this.onMessage);
	}

	setUpEvents() {
		// Add message event listener
		if (document) {
			document.addEventListener("message", this.onMessage.bind(this));
		} 
		if (window) {
			window.addEventListener("message", this.onMessage.bind(this));
		}

		this.state.quill.on("selection-change", (range, oldRange, source) => {
			if (range === null) {
				this.sendMessage("EDITOR_BLUR");
				return;
			}
			
			let formats = this.state.quill.getFormat(range);

			this.sendMessage("FORMATTING", {
				formatState: formats
			});
		});
	}

	onMessage(e) {
		try {
			const messageData = JSON.parse(e.data);

			if (messageData.hasOwnProperty("message") && messageData.message.startsWith(MESSAGE_PREFIX)) {
				const messageType = messageData.message.replace(MESSAGE_PREFIX, "");

				this.addDebug(`Received event: ${messageType}`);

				switch (messageType) {
					case "SET_FORMAT":
						this.setFormat(messageData);
						break;
					/*case "BOLD":
						this.state.quill.format('bold', messageData.active);
					
					\break;
					case "ITALIC":
						this.state.quill.format('italic', messageData.active);
						break;
					case "UNDERLINE":
						this.state.quill.format('underline', messageData.active);
						break;
					case "LIST":
						this.state.quill.format('list', !messageData.active ? false : messageData.type);
						break;*/
				}
			}
		} catch (err) {
			this.addDebug(err);
		}
	}

	setFormat(data) {
		this.state.quill.format(data.type, data.option || false, 'user');
	}

	sendMessage(message, data = {}) {
		this.addDebug(`Sending ${message}`);

		const messageToSend = JSON.stringify({
			message: `${MESSAGE_PREFIX}${message}`,
			...data
		});

		if (document.hasOwnProperty("postMessage")) {
			document.postMessage(messageToSend, "*");
		} else if (window.hasOwnProperty("postMessage")) {
			window.postMessage(messageToSend, "*");
		} else {
			this.addDebug(`ERROR: unable to send message`);
		}
	}

	addDebug(message) {
		if (DEBUG) {
			if( typeof message == 'object' ){
				message = util.inspect(message, { showHidden: false, depth: null });
			}

			this.setState({
				debug: this.state.debug.concat(message)
			});
		}
	}

	render() {
		return (
			<React.Fragment>
				<div id="container" style={{ height: DEBUG ? "50%" : "100%", display: "flex", flexDirection: "column" }}>
					<div id="quill" style={{ fontSize: "16px", height: "100%" }} />
				</div>
				{DEBUG ? (
					<div style={{ overflow: "auto", height: "50%" }}>
						<strong>Debug:</strong>
						<ul>{this.state.debug.map(message => <li>{message}</li>)}</ul>
					</div>
				) : null}
			</React.Fragment>
		);
	}
}

export default QuillComponent;
