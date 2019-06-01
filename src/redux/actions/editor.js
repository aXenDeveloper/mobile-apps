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
export const SET_UPLOAD_LIMIT = "SET_UPLOAD_LIMIT";
export const setUploadLimit = data => ({
	type: SET_UPLOAD_LIMIT
});
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

export const SET_UPLOAD_PROGRESS = "SET_UPLOAD_PROGRESS";
export const setUploadProgress = data => ({
	type: SET_UPLOAD_PROGRESS,
	payload: {
		...data
	}
});

export const SET_UPLOAD_STATUS = "SET_UPLOAD_STATUS";
export const setUploadStatus = data => ({
	type: SET_UPLOAD_STATUS,
	payload: {
		...data
	}
});

export const UPLOAD_STATUS = {
	PENDING: "pending",
	UPLOADING: "uploading",
	DONE: "done",
	ERROR: "error"
};

import gql from "graphql-tag";
import { FileSystem, ImageManipulator } from "expo";
import _ from "underscore";

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

export const uploadImage = (data, uploadRestrictions, editorID) => {
	return async (dispatch, getState) => {
		const fileName = data.uri.split("/").pop();
		//const { maxChunkSize } = uploadRestrictions;
		const maxChunkSize = 6000;
		const state = getState();
		const client = state.auth.client;
		const maxImageDim = Expo.Constants.manifest.extra.max_image_dim;

		let canonicalFile = data;

		// If width or height is > 1000, resize
		if (data.width > maxImageDim || data.height > maxImageDim) {
			const resizedImage = await ImageManipulator.manipulateAsync(
				data.uri,
				[{ resize: data.width > maxImageDim ? { width: maxImageDim } : { height: maxImageDim } }],
				{
					compress: 0.7,
					format: "jpeg"
				}
			);
			canonicalFile = resizedImage;
		}

		try {
			const realFile = await FileSystem.readAsStringAsync(canonicalFile.uri, { encoding: FileSystem.EncodingTypes.Base64 });
			const buf = Buffer.from(realFile, "base64");
			let requiresChunking = false;

			dispatch(
				addUploadedImage({
					id: fileName,
					localFilename: canonicalFile.uri,
					fileSize: buf.length,
					width: canonicalFile.width,
					height: canonicalFile.height
				})
			);

			dispatch(
				setUploadStatus({
					id: fileName,
					status: UPLOAD_STATUS.UPLOADING
				})
			);

			// We need to figure out the max allowed size of a chunk, allowing for the fact it'll be base64'd
			// which adds approx 33% to the size. The -3 is to allow for up to three padding characters that
			// base64 will add
			const theoreticalMaxChunkSize = Math.floor((maxChunkSize / 4) * 3 - 3);

			// If the file length is bigger than our acceptable chunk size AFTER base64 encoding, we need to chunk
			// if supported. If we can't chunk, we have to error for this file.
			if (realFile.length > theoreticalMaxChunkSize) {
				if (uploadRestrictions.chunkingSupported) {
					requiresChunking = true;
				} else {
					// @todo throw error - file too big
				}
			}

			const bufPieces = [];
			const uploadData = {
				name: fileName,
				postKey: editorID
			};

			if (requiresChunking) {
				// If we're chunking, then we slice the Buffer and reencode each piece as base64
				const bufLen = buf.length;
				let i = 0;

				while (i < bufLen) {
					const piece = buf.slice(i, (i += theoreticalMaxChunkSize));
					bufPieces.push(piece.toString("base64"));
				}
			} else {
				bufPieces.push(realFile);
			}

			const receivedData = await uploadFile(client, bufPieces, uploadData, (totalLoaded, totalSize) => {
				dispatch(
					setUploadProgress({
						id: fileName,
						progress: Math.min(Math.round((totalLoaded / totalSize) * 100), 100)
					})
				);
			});

			dispatch(
				setUploadStatus({
					id: fileName,
					status: UPLOAD_STATUS.DONE
				})
			);
		} catch (err) {
			console.log(`Error uploading image: ${err}`);

			dispatch(
				setUploadStatus({
					id: fileName,
					status: UPLOAD_STATUS.ERROR
				})
			);
		}
	};
};

/**
 * Handles uploading a file via a GQL mutation. Takes an array of pieces for chunking.
 *
 * @param 	{object} 			client 		The GQL client to use for the mutation
 * @param 	{array|string}		pieces 		The pieces to be uploaded
 * @param 	{object}			variables 	Any additional variables to be send with the mutation
 * @param 	{function}			onProgress 	A function that will be called when upload progress happens
 * @return 	void
 */
const uploadFile = async (client, pieces, variables, onProgress) => {
	if (!_.isArray(pieces)) {
		pieces = [pieces];
	}

	const totalSize = pieces.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0);
	let totalLoaded = 0;

	const sendMutation = async (contents, additionalParams = {}) => {
		let thisFileUploaded = 0;
		const { data } = await client.mutate({
			mutation: uploadMutation,
			variables: {
				...variables,
				...additionalParams,
				contents
			},
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: ev => {
						thisFileUploaded = ev.loaded;
						onProgress(totalLoaded + thisFileUploaded, totalSize);
					}
				}
			}
		});

		totalLoaded += thisFileUploaded;
		return data;
	};

	let data;

	if (pieces.length > 1) {
		let i = 1;
		for (let piece of pieces) {
			data = await sendMutation(piece, { totalChunks: pieces.length, chunk: i++ });
		}
	} else {
		data = await sendMutation(pieces[0]);
	}

	return data;
};
