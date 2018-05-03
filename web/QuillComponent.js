import Quill from "quill/dist/quill.min.js";
import "quill/dist/quill.core.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";

const BROWSER = true;
const DEBUG = true;

const MESSAGE_PREFIX = '__IPS__';

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
		this.setState({
			quill: new Quill("#quill", {
				bounds: '#container',
				placeholder: 'Content'
			})
		}, () => {
			this.setUpEvents();
		});
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.onMessage);
	}

	setUpEvents() {
		// Add message event listener
		if( document ){
			document.addEventListener('message', this.onMessage);
		} else if (window) {
			window.addEventListener('message', this.onMessage);
		} else {
			console.log("Can't add message handler");
		}

		this.state.quill.on('selection-change', (range, oldRange, source) => {
			if(range === null){
				this.sendMessage('EDITOR_BLUR');
			} else {
				this.sendMessage('EDITOR_FOCUS');
			}
		});
	}

	onMessage(e) {
		console.log(e.data);
	}

	sendMessage(message, data = {}){
		this.addDebug(`Sending ${message}`);

		const messageToSend = JSON.stringify({
			message: `${MESSAGE_PREFIX}${message}`,
			...data
		});

		if (document.hasOwnProperty('postMessage')) {
			document.postMessage(messageToSend, '*');
		} else if (window.hasOwnProperty('postMessage')) {
			window.postMessage(messageToSend, '*');
		} else {
			this.addDebug(`ERROR: unable to send message`);
		}
	}

	addDebug(message) {
		if( DEBUG ){
			this.setState({
				debug: this.state.debug.concat(message)
			});
		}
	}

	render() {
		return (
			<React.Fragment>
				<div id="container" style={{ height: DEBUG ? '50%' : '100%', display: 'flex', flexDirection: 'column' }}>
					<div id="quill" style={{ fontSize: "16px", height: '100%' }} />
				</div>
				{DEBUG ? 
					<div style={{overflow: 'auto', height: '50%'}}>
						<strong>Debug:</strong>
						<ul>
							{this.state.debug.map((message) => (
								<li>{message}</li>
							))}
						</ul>
					</div>
				: null}
			</React.Fragment>
		);
	}
}

export default QuillComponent;
