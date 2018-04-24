import Quill from "quill/dist/quill.min.js";
import "quill/dist/quill.core.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";

const BROWSER = true;
const DEBUG = false;

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
			})
		}, () => {
			// Add message event listener
			if( document ){
				document.addEventListener('message', this.onMessage);
			} else if (window) {
				window.addEventListener('message', this.onMessage);
			} else {
				console.log("Can't add message handler");
			}
		});
	}

	componentWillUnmount() {
		window.removeEventListener('message', this.onMessage);
	}

	onMessage(e) {
		console.log(e.data);
	}

	addDebug(message) {
		this.setState({
			debug: this.state.debug.push(message)
		});
	}

	render() {
		return (
			<React.Fragment>
				<div id="container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					<div id="quill" style={{ fontSize: "16px", height: '100%' }} />
				</div>
				{DEBUG ? 
					<div style={{overflow: 'auto', height: '200px'}}>
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
