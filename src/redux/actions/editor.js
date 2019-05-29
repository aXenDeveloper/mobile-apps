export const SET_FOCUS = "SET_FOCUS";
export const setFocus = data => ({
	type: SET_FOCUS,
	payload: {
		...data
	}
});

// ------------------------------------------------------------
export const SET_FORMATTING = "SET_FORMATTING";
export const setFormatting = data => ({
	type: SET_FORMATTING,
	payload: {
		...data
	}
});
export const SET_BUTTON_STATE = "SET_BUTTON_STATE";
export const setButtonState = data => ({
	type: SET_BUTTON_STATE,
	payload: {
		...data
	}
});

// ------------------------------------------------------------
export const RESET_EDITOR = "RESET_EDITOR";
export const resetEditor = data => ({
	type: RESET_EDITOR
});

// ------------------------------------------------------------
export const OPEN_LINK_MODAL = "OPEN_LINK_MODAL";
export const openLinkModal = data => ({
	type: OPEN_LINK_MODAL
});
export const CLOSE_LINK_MODAL = "CLOSE_LINK_MODAL";
export const closeLinkModal = data => ({
	type: CLOSE_LINK_MODAL
});

// ------------------------------------------------------------
export const SHOW_MENTION_BAR = "SHOW_MENTION_BAR";
export const showMentionBar = data => ({
	type: SHOW_MENTION_BAR
});
export const HIDE_MENTION_BAR = "HIDE_MENTION_BAR";
export const hideMentionBar = data => ({
	type: HIDE_MENTION_BAR
});
export const LOADING_MENTIONS = "LOADING_MENTIONS";
export const loadingMentions = data => ({
	type: LOADING_MENTIONS
});
export const UPDATE_MENTION_RESULTS = "UPDATE_MENTION_RESULTS";
export const updateMentionResults = data => ({
	type: UPDATE_MENTION_RESULTS,
	payload: data
});
export const INSERT_MENTION_SYMBOL = "INSERT_MENTION_SYMBOL";
export const insertMentionSymbol = data => ({
	type: INSERT_MENTION_SYMBOL
});
export const INSERT_MENTION_SYMBOL_DONE = "INSERT_MENTION_SYMBOL_DONE";
export const insertMentionSymbolDone = data => ({
	type: INSERT_MENTION_SYMBOL_DONE
});

// ------------------------------------------------------------
export const OPEN_IMAGE_PICKER = "OPEN_IMAGE_PICKER";
export const openImagePicker = data => ({
	type: OPEN_IMAGE_PICKER
});
export const RESET_IMAGE_PICKER = "RESET_IMAGE_PICKER";
export const resetImagePicker = data => ({
	type: RESET_IMAGE_PICKER
});
export const ADD_UPLOADED_IMAGE = "ADD_UPLOADED_IMAGE";
export const addUploadedImage = data => ({
	type: ADD_UPLOADED_IMAGE,
	payload: {
		...data
	}
});

import gql from "graphql-tag";
import { FileSystem, ImageManipulator } from "expo";

import { graphql, compose } from "react-apollo";
//import console = require("console");

const uploadMutation = gql`
	mutation UploadAttachmentMutation($name: String!, $contents: String!, $chunk: Int, $totalChunks: Int, $postKey: String!) {
		mutateCore {
			uploadAttachment(name: $name, contents: $contents, postKey: $postKey, chunk: $chunk, totalChunks: $totalChunks) {
				id
				name
				size
				thumbnail {
					url
					width
					height
				}
				uploader {
					id
					name
				}
			}
		}
	}
`;

export const uploadImage = (data, uploadRestrictions) => {
	return async (dispatch, getState) => {
		const fileName = data.uri.split("/").pop();
		const { maxChunkSize } = uploadRestrictions;
		//const maxChunkSize = 5000;
		const state = getState();
		const client = state.auth.client;

		dispatch(
			addUploadedImage({
				id: fileName,
				localFilename: data.uri,
				width: data.width,
				height: data.height
			})
		);

		let canonicalFileUri = data.uri;

		// If width or height is > 1000, resize
		if (data.width > 1000 || data.height > 1000) {
			console.log("Resizing image...");
			const resizedImage = await ImageManipulator.manipulateAsync(data.uri, [{ resize: data.width > 1000 ? { width: 1000 } : { height: 1000 } }], {
				compress: 0.7,
				format: "jpeg"
			});
			canonicalFileUri = resizedImage.uri;
			console.log("Resizing image done");
		}

		try {
			const realFile = await FileSystem.readAsStringAsync(canonicalFileUri, { encoding: FileSystem.EncodingTypes.Base64 });
			const buf = Buffer.from(realFile, "base64");
			let requiresChunking = false;

			// If the file length is bigger than our acceptable chunk size AFTER base64 encoding, we need to chunk
			// if supported. If we can't chunk, we have to error for this file.
			if (realFile.length > maxChunkSize) {
				if (uploadRestrictions.chunkingSupported) {
					requiresChunking = true;
				} else {
					// @todo throw error - file too big
				}
			}

			const uploadData = {
				name: fileName,
				postKey: uploadRestrictions.postKey,
			};

			if (requiresChunking) {
				// If we're chunking, then we slice the Buffer and reencode each piece as base64
				const bufPieces = [];
				const bufLen = buf.length;
				let i = 0;
				let chunk = 1;

				while (i < bufLen) {
					const piece = buf.slice(i, (i += maxChunkSize));
					bufPieces.push(piece.toString("base64"));
				}

				receivedData = await uploadFile(client, bufPieces, uploadData);
			} else {
				receivedData = await uploadFile(client, realFile, uploadData);
			}

			console.log(receivedData);
		} catch (err) {
			console.log(err);
		}
	};
};

const uploadFile = async (client, pieces, variables) => {
	if( !_.isArray(pieces) ){
		pieces = [pieces];
	}

	return new Promise((resolve, reject) => {



		
		const { data } = await client.mutate({
			mutation: uploadMutation,
			variables: {
				...variables,
				contents: item
			},
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: ev => {
						console.log(`${Math.round((ev.loaded / ev.total) * 100)}% uploaded`);
					}
				}
			}
		});
	});
}