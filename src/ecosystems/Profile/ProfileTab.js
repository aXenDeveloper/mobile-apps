import React, { Component } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Tab } from "native-base";

import { styleVars } from "../../styles";

class ProfileTab extends Component {
	constructor(props){ 
		super(props);
		this._height = 500;
		this.state = {
			height: this._height
		};
	}

	onLayout = ({
		nativeEvent: {
			layout: { height }
		}
	}) => {
		//this._height = Math.max( height, this.props.minHeight );

		console.log("Height is " + height + " in tab " + this.props.tabIndex);

		//console.log("Height " + this._height + " for tab " + this.props.tabIndex);

		//if( this.props.active ){
			this.setState({
				height
			});
		//}
	}

	componentDidUpdate(prevProps) {
		/*if( prevProps.active !== this.props.active ){
			//console.log("Tab " + this.props.tabIndex + " is active, height " + this._height);
			this.setState({
				height: this._height
			});
		}*/
	}

	render() {
		let fixedHeight = null;

		/*if( this.state.height < this.props.minHeight && this.props.active ){
			console.log(this.props.tabIndex + ": Setting min height to " + this.props.minHeight);
			fixedHeight = { height: this.props.minHeight };
		} else {
			console.log(this.props.tabIndex + ": " + this.state.height + " is more than the minHeight");
		}*/

		return (
			<Tab heading={this.props.heading} style={{ backgroundColor: styleVars.appBackground }}>
				<View>
					{this.props.active && this.props.children}
				</View>
			</Tab>
		);
	}
}

export default ProfileTab;