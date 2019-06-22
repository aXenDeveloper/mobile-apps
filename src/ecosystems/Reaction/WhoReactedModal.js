import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import gql from "graphql-tag";
import { graphql, compose, withApollo } from "react-apollo";
import Modal from "react-native-modal";

import Lang from "../../utils/Lang";
import MemberRow from "../../ecosystems/MemberRow";
import { PlaceholderRepeater } from "../../ecosystems/Placeholder";
import getImageUrl from "../../utils/getImageUrl";
import ErrorBox from "../../atoms/ErrorBox";
import styles, { styleVars } from "../../styles";

const LIMIT = 25;

class WhoReactedModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			results: null,
			error: false,
			offset: 0,
			reachedEnd: false
		};
		this.preOnPressCallback = this.preOnPressCallback.bind(this);
		this.onEndReached = this.onEndReached.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.visible) {
			if (!prevProps.visible && this.state.results === null) {
				this.fetchData();
			} else if (prevProps.variables.reactionID !== this.props.variables.reactionID) {
				this.setState(
					{
						results: null,
						error: false,
						offset: 0,
						reachedEnd: false
					},
					() => {
						this.fetchData();
					}
				);
			}
		}
	}

	async fetchData() {
		this.setState({
			loading: true
		});

		try {
			const { data } = await this.props.client.query({
				query: this.props.query,
				variables: {
					...this.props.variables,
					offset: this.state.offset,
					limit: LIMIT
				}
			});

			this.setState({
				results: [...(this.state.results || []), ...data.app.type.reputation.whoReacted],
				loading: false,
				error: false,
				offset: this.state.offset + data.app.type.reputation.whoReacted.length,
				reachedEnd: this.state.reachedEnd || data.app.type.reputation.whoReacted.length < LIMIT
			});
		} catch (err) {
			console.log(err);
			this.setState({
				error: true,
				loading: false
			});
		}
	}

	preOnPressCallback() {
		this.props.close();
	}

	onEndReached() {
		if (!this.state.loading && !this.state.reachedEnd) {
			this.fetchData();
		}
	}

	getPlaceholder() {
		return (
			<PlaceholderRepeater repeat={5}>
				<MemberRow loading={true} />
			</PlaceholderRepeater>
		);
	}

	render() {
		let content;

		if (this.state.loading) {
			content = (
				<PlaceholderRepeater repeat={5}>
					<MemberRow loading={true} />
				</PlaceholderRepeater>
			);
		} else if (this.state.error) {
			content = <ErrorBox message={Lang.get("cant_show_reactions")} showIcon={false} transparent />;
		} else if (this.state.results !== null && this.state.results.length) {
			content = (
				<FlatList
					data={this.state.results}
					renderItem={({ item }) => (
						<MemberRow
							key={item.id}
							id={parseInt(item.id)}
							name={item.name}
							photo={item.photo}
							groupName={item.group.name}
							preOnPressCallback={this.preOnPressCallback}
						/>
					)}
					keyExtractor={item => item.id}
					onEndReached={this.onEndReached}
				/>
			);
		}

		let height = 400;

		/*if( this.props.expectedCount ){
			height = Math.min( height, parseInt( this.props.expectedCount ) * 50 );
		}*/

		return (
			<Modal style={styles.modalAlignBottom} swipeDirection="down" onSwipeComplete={this.props.close} isVisible={this.props.visible}>
				<View style={styles.modalInner}>
					<View style={styles.modalHandle} />
					<View style={styles.modalHeader}>
						<View style={componentStyles.titleBar}>
							<Text style={[styles.modalTitle, componentStyles.title]}>Who Reacted</Text>
							<Image source={{ uri: getImageUrl(this.props.reactionImage) }} resizeMode="contain" style={componentStyles.reactionImage} />
						</View>
						<TouchableOpacity onPress={this.props.close}>
							<Image source={require("../../../resources/close_circle.png")} resizeMode="contain" style={styles.modalClose} />
						</TouchableOpacity>
					</View>
					<View style={{ height }}>{content}</View>
				</View>
			</Modal>
		);
	}
}

export default compose(withApollo)(WhoReactedModal);

const componentStyles = StyleSheet.create({
	titleBar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	title: {
		marginHorizontal: 0,
		marginRight: styleVars.spacing.standard
	},
	reactionImage: {
		width: 22,
		height: 22
	}
});
