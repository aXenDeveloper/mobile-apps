import React, { Component } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { connect } from "react-redux";
import _ from "underscore";
import { QuillToolbarButton } from "./QuillToolbarButton";
import { QuillToolbarSeparator } from "./QuillToolbarSeparator";
import { setFocus, setButtonState, openLinkModal, openImagePicker } from "../../redux/actions/editor";

class QuillToolbar extends Component {
	constructor(props) {
		super(props);
	}

	toggleFormatting(button, option = null) {
		let state = false;

		// Some buttons e.g. list have options, in which case we want to reverse
		// the state of the option, not the button
		if (!_.isBoolean(this.props.editor.formatting[button])) {
			state = !this.props.editor.formatting[button][option];
		} else {
			state = !this.props.editor.formatting[button];
		}

		this.props.dispatch(
			setButtonState({
				button,
				option,
				state
			})
		);
	}

	openLinkModal() {
		this.props.dispatch(openLinkModal());
	}

	openImagePicker() {
		this.props.dispatch(openImagePicker());
	}

	render() {
		return (
			<KeyboardAccessoryView hideBorder visibleOpacity={this.props.editor.focused ? 1 : 0}>
				<View style={[toolbarStyles.toolbarOuter]}>
					<View style={toolbarStyles.toolbarInner}>
						<QuillToolbarButton 
							icon={require("../../../resources/image.png")}
							onPress={() => this.openImagePicker()} 
						/>
						<QuillToolbarButton
							active={this.props.editor.linkModalActive}
							icon={require("../../../resources/link.png")}
							onPress={() => this.openLinkModal()}
						/>
						<QuillToolbarSeparator />
						<QuillToolbarButton
							active={this.props.editor.formatting.bold}
							icon={require("../../../resources/bold.png")}
							onPress={() => this.toggleFormatting("bold")}
						/>
						<QuillToolbarButton
							active={this.props.editor.formatting.italic}
							icon={require("../../../resources/italic.png")}
							onPress={() => this.toggleFormatting("italic")}
						/>
						<QuillToolbarButton
							active={this.props.editor.formatting.underline}
							icon={require("../../../resources/underline.png")}
							onPress={() => this.toggleFormatting("underline")}
						/>
						<QuillToolbarButton
							active={this.props.editor.formatting.list.bullet}
							icon={require("../../../resources/list_unordered.png")}
							onPress={() => this.toggleFormatting("list", "bullet")}
						/>
						<QuillToolbarButton
							active={this.props.editor.formatting.list.ordered}
							icon={require("../../../resources/list_ordered.png")}
							onPress={() => this.toggleFormatting("list", "ordered")}
						/>
					</View>
				</View>
			</KeyboardAccessoryView>
		);
	}
}

export default connect(state => ({
	editor: state.editor
}))(QuillToolbar);

const toolbarStyles = StyleSheet.create({
	toolbarOuter: {
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#c7c7c7"
	},
	toolbarInner: {
		height: 44,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	}
});
