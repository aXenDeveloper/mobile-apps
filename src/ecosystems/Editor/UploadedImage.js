import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import ActionSheet from "react-native-actionsheet";
import * as Animatable from "react-native-animatable";

import { UPLOAD_STATUS } from "../../redux/actions/editor";
import { AnimatedCircularProgress } from "../../ecosystems/CircularProgress";
import Lang from "../../utils/Lang";
import styles, { styleVars } from "../../styles";

export class UploadedImage extends PureComponent {
	constructor(props) {
		super(props);
		this.actionSheetPress = this.actionSheetPress.bind(this);
		this.showActionSheet = this.showActionSheet.bind(this);

		this._uploadOverlay = null;
		this._uploadProgress = null;

		this.state = {
			destructiveButtonIndex: this.props.status === UPLOAD_STATUS.DONE ? 2 : null,
			actionSheetOptions: this.getActionSheetOptions()
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.status !== this.props.status) {
			if (this.props.status === UPLOAD_STATUS.DONE) {
				this._uploadProgress.zoomOut(200).then(() => {
					this._uploadOverlay.fadeOut();
				});

				this.setState({
					destructiveButtonIndex: 2,
					actionSheetOptions: this.getActionSheetOptions()
				});
			}
		}
	}

	componentWillMount() {
		clearTimeout(this._animationTimer);
	}

	getActionSheetOptions() {
		if (this.props.status === UPLOAD_STATUS.DONE) {
			return [Lang.get("cancel"), Lang.get("insert_into_post"), Lang.get("delete_image")];
		} else {
			return [Lang.get("cancel"), Lang.get("cancel_upload")];
		}
	}

	//====================================================================
	// ACTION SHEET CONFIG

	/**
	 * Handle tapping an action sheet item
	 *
	 * @return 	void
	 */
	actionSheetPress(i) {
		console.log(`action sheet ${i}`);
	}

	showActionSheet() {
		this._actionSheet.show();
	}

	render() {
		return (
			<TouchableOpacity style={[styles.mrStandard, componentStyles.uploadedImageWrapper]} onPress={this.showActionSheet}>
				<Image source={{ uri: this.props.image }} resizeMode="cover" style={componentStyles.uploadedImage} />
				{(this.props.status === UPLOAD_STATUS.UPLOADING || this.props.status === UPLOAD_STATUS.DONE) && (
					<Animatable.View
						ref={ref => (this._uploadOverlay = ref)}
						style={[styles.flex, styles.flexAlignCenter, styles.flexJustifyCenter, componentStyles.uploadingOverlay]}
					>
						<Animatable.View ref={ref => (this._uploadProgress = ref)}>
							<AnimatedCircularProgress size={34} width={17} rotation={0} fill={this.props.progress || 0} tintColor="#fff" />
						</Animatable.View>
					</Animatable.View>
				)}
				<ActionSheet
					ref={o => (this._actionSheet = o)}
					title={Lang.get("attachment_options")}
					options={this.state.actionSheetOptions}
					cancelButtonIndex={0}
					destructiveButtonIndex={this.state.destructiveButtonIndex}
					onPress={this.actionSheetPress}
				/>
			</TouchableOpacity>
		);
	}
}

//<ActivityIndicator size='small' color='#fff' />

const componentStyles = StyleSheet.create({
	uploadedImageWrapper: {
		width: 60,
		height: 60,
		borderRadius: 6,
		overflow: "hidden"
	},
	uploadedImage: {
		backgroundColor: styleVars.greys.medium,
		width: 60,
		height: 60
	},
	uploadingOverlay: {
		backgroundColor: "rgba(0,0,0,0.4)",
		...StyleSheet.absoluteFillObject
	}
});
