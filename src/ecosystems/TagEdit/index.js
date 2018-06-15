import React, { Component } from "react";
import { Text, View, TouchableOpacity, TouchableHighlight, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import styles from "../../styles";

export default class TagEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false
		};
	}

	onPress() {
		console.log("Tag press");
		this.setState({
			modalVisible: true
		});
	}

	hideModal() {
		this.setState({
			modalVisible: false
		});
	}

	render() {
		return (
			<View style={[styles.field, tagStyles.outerWrap]}>
				<View style={tagStyles.innerWrap}>
					<Text style={[styles.fieldText, styles.fieldTextPlaceholder]}>Tags</Text>
					<TouchableOpacity onPress={() => this.onPress()}>
						<Image source={require("../../../resources/plus.png")} style={tagStyles.plus} />
					</TouchableOpacity>
				</View>
				<Modal
					style={modalStyles.modal}
					avoidKeyboard={true}
					animationIn="slideInUp"
					isVisible={this.state.modalVisible}
					onBackdropPress={() => this.hideModal()}
				>
					<View style={[styles.modal]}>
						<View style={styles.modalHeader}>
							<TouchableOpacity onPress={() => { }}>
								<Text>Cancel</Text>
							</TouchableOpacity>
							<Text style={styles.modalTitle}>Select Tags</Text>
							<TouchableOpacity onPress={() => { }}>
								<Text>Done</Text>
							</TouchableOpacity>
						</View>
						<View style={[modalStyles.mainBody]}>
							{this.props.definedTags.map( (tag) => (
								<TouchableHighlight style={[modalStyles.tagItem]} key={tag}>
									<Text style={[modalStyles.tagItemText]}>{tag}</Text>
								</TouchableHighlight>
							))}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const tagStyles = StyleSheet.create({
	outerWrap: {
		minHeight: 52
	},
	innerWrap: {
		display: "flex",
		width: "100%",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	plus: {
		tintColor: "#3370AA",
		width: 20,
		height: 20
	}
});

const modalStyles = StyleSheet.create({
	mainBody: {
		backgroundColor: '#fff',
		paddingHorizontal: 16
	},
	tagItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F2F4F7'
	},
	tagItemText: {
		fontSize: 16,
	}
});
