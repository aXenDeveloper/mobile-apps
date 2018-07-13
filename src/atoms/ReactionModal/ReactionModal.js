import React, { Component } from "react";
import { Image, Text, View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import ReactionChoice from './ReactionChoice';

export default class ReactionModal extends Component {
	constructor(props) {
		super(props);
		this.animatedValue = [];

		props.reactions.map( reaction => {
			this.animatedValue[ reaction.id ] = new Animated.Value(-400);
		});
	}

	startAnimation() {
		const animations = this.props.reactions.map( reaction => {
			return Animated.timing(
				this.animatedValue[ reaction.id ],
				{
					toValue: 0,
					duration: 450
				}
			);
		});

		Animated.stagger( 35, animations ).start();
	}

	onModalShow() {
		this.startAnimation();
	}

	onModalHide() {
		// Reset animated values
		this.props.reactions.map( reaction => {
			this.animatedValue[ reaction.id ] = new Animated.Value(-400);
		});
	}

	pressReaction(reactionID) {
		this.props.closeModal();
		this.props.onReactionPress(reactionID);
	}

	render() {
		const animatedComponents = this.props.reactions.map( (reaction) => (
			<View key={reaction.id} style={{ height: 50 }}>
				<Animated.View style={{ position: 'absolute', right: this.animatedValue[ reaction.id ] }}>
					<ReactionChoice name={reaction.name} image={reaction.image} onPress={() => this.pressReaction(reaction.id)} />
				</Animated.View>
			</View>
		));

		return (
			<Modal
				style={componentStyles.modal}
				isVisible={this.props.visible}
				animationInTiming={100}
				onBackdropPress={this.props.closeModal}
				onModalHide={() => this.onModalHide()}
				onModalShow={() => this.onModalShow()}
			>
				<View style={componentStyles.container}>
					{animatedComponents}
				</View>
			</Modal>
		);
	}
}


const componentStyles = StyleSheet.create({
	modal: {
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-end'
	}
});