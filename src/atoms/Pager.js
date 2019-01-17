import React, { PureComponent } from "react";
import { Text, View, Button, StyleSheet, TouchableHighlight, Animated, PanResponder } from "react-native";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";
import _ from "underscore";

import Lang from "../utils/Lang";
import ActionBar from "./ActionBar";
import styles, { styleVars } from "../styles";

export default class Pager extends PureComponent {
	constructor(props) {
		super(props);
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetPanResponderCapture: () => true,
			onMoveShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderGrant: this.onPanResponderGrant.bind(this),
			onPanResponderMove: this.onPanResponderMove.bind(this),
			onPanResponderRelease: this.onPanResponderRelease.bind(this),
			onPanResponderTerminate: this.onPanResponderTerminate.bind(this)
		});

		this.onWrapperLayout = this.onWrapperLayout.bind(this);
		this._wrapperWidth = 0;

		this.state = {
			isBeingTouched: false,
			jumpingToPost: 1
		};
	}

	componentDidMount() {
		this._updateBar();
	}

	/**
	 * onLayout handler for our wrapper changing size.
	 * Used to get the width of our component so we can calculate percentage positions.
	 *
	 * @param 	object 		event 		Event object
	 * @return 	void
	 */
	onWrapperLayout(event) {
		const { width } = event.nativeEvent.layout;
		this._wrapperWidth = width;
	}

	/**
	 * Pan gesture begins
	 *
	 * @return 	void
	 */
	onPanResponderGrant() {
		this.setState({
			isBeingTouched: true
		});
	}

	/**
	 * User pans
	 *
	 * @param 	object 		evt 			Event object
	 * @param 	object 		gestureState	Contains coords and other info for touch gesture
	 * @return 	void
	 */
	onPanResponderMove(evt, gestureState) {
		const moveX = gestureState.moveX;
		const percentageX = (moveX / this._wrapperWidth * 100).toFixed(1);

		this._trackerBarRef.transitionTo({ width: `${percentageX}%` });

		this.setState({
			jumpingToPost: Math.ceil(this.props.total / 100 * percentageX)
		});
	}

	/**
	 * User releases touch
	 *
	 * @return 	void
	 */
	onPanResponderRelease() {
		// The user has released all touches while this view is the
		// responder. This typically means a gesture has succeeded
		this.setState({
			isBeingTouched: false
		});
	}

	/**
	 * Touch is terminated (e.g. another component takes touch focus)
	 *
	 * @return 	void
	 */
	onPanResponderTerminate() {
		this.setState({
			isBeingTouched: false
		});
	}

	/**
	 * Update tracker bar if our position has changed
	 *
	 * @param 	object 		prevProps 		Previous props object
	 * @return 	void
	 */
	componentDidUpdate(prevProps, prevState) {
		if (prevState.isBeingTouched && !this.state.isBeingTouched) {
			this._updateBar();
		}

		if (!this.state.isBeingTouched && prevProps.currentPosition !== this.props.currentPosition) {
			this._updateBar();
		}

		if (!prevState.isBeingTouched && this.state.isBeingTouched) {
			this._actionBarRef.transitionTo({ height: 75, maxHeight: 75 });
		} else if (prevState.isBeingTouched && !this.state.isBeingTouched) {
			this._actionBarRef.transitionTo({ height: 30, maxHeight: 30 });

			if (this.props.onChange) {
				this.props.onChange(this.state.jumpingToPost);
			}
		}
	}

	/**
	 * Calculates % and transitions bar
	 *
	 * @return 	void
	 */
	_updateBar() {
		const trackerWidth = Math.ceil(parseInt(this.props.currentPosition) / parseInt(this.props.total) * 100);
		this._trackerBarRef.transitionTo({ width: `${trackerWidth}%` });
	}

	render() {
		if (this.props.total < 1) {
			return null;
		}

		let unreadPosition = 0;
		if (this.props.unreadIndicator && this.props.unreadIndicator > 0) {
			unreadPosition = Math.ceil(parseInt(this.props.unreadIndicator) / parseInt(this.props.total) * 100);
		}

		return (
			<Animatable.View
				style={[
					styles.flex,
					styles.flexAlignCenter,
					styles.flexJustifyCenter,
					styles.tBorder,
					styles.mediumBorder,
					componentStyles.pager
				]}
				ref={ref => (this._actionBarRef = ref)}
				onLayout={this.onWrapperLayout}
			>
				<View style={[componentStyles.trackerWrapper]} {...this._panResponder.panHandlers}>
					<Animatable.View ref={ref => (this._trackerBarRef = ref)} style={[componentStyles.trackerBar, { width: "0%" }]} />
				</View>
				<Animatable.View ref={ref => (this._trackerTextRef = ref)} style={{ opacity: 1 }}>
					<Text style={componentStyles.trackerText}>
						{Lang.get('pagination', {
							from: this.state.isBeingTouched ? this.state.jumpingToPost : this.props.currentPosition,
							to: this.props.total
						})}
					</Text>
				</Animatable.View>
				{unreadPosition && (
					<View style={[componentStyles.unreadBar, { left: `${unreadPosition}%` }]}>
						<Text>-</Text>
					</View>
				)}
			</Animatable.View>
		);
	}
}

const componentStyles = StyleSheet.create({
	pager: {
		height: 30,
		maxHeight: 30,
		backgroundColor: styleVars.greys.light
	},
	trackerWrapper: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	trackerBar: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		backgroundColor: styleVars.greys.darker
	},
	trackerActiveText: {
		color: "#fff"
	},
	trackerText: {
		fontWeight: "500",
		fontSize: styleVars.fontSizes.small,
		color: styleVars.lightText
	},
	unreadBar: {
		position: "absolute",
		top: 3,
		bottom: 3,
		width: 1,
		borderRightWidth: 1,
		borderRightColor: styleVars.greys.darker,
	}
});

Pager.defaultProps = {
	currentPosition: 1,
	onChange: () => {}
};

Pager.propTypes = {
	currentPosition: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	onChange: PropTypes.func
};
