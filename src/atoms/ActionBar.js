import React, { PureComponent } from "react";
import { View } from "react-native";

import { withTheme } from "../themes";
//import styles, { styleVars } from "../styles";

class ActionBar extends PureComponent {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.onRef && this._wrapperRef) {
			this.props.onRef(this._wrapperRef);
		}
	}

	render() {
		const { componentStyles } = this.props;

		return (
			<View
				style={[componentStyles.pager, this.props.light ? componentStyles.light : componentStyles.dark, this.props.style]}
				ref={ref => (this._wrapperRef = ref)}
			>
				{this.props.children}
			</View>
		);
	}
}

const _componentStyles = styleVars => ({
	pager: {
		height: 45,
		minHeight: 45,
		padding: 7,
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	dark: {
		backgroundColor: "#37454B" // @todo color
	},
	light: {
		backgroundColor: styleVars.greys.light,
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,0.1)" // @todo color
	}
});

export default withTheme(_componentStyles)(ActionBar);
