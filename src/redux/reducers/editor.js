import * as actions from "../actions/editor";
import _ from "underscore";

const initialState = {
	focused: false,
	linkModalActive: false,
	imagePickerOpened: false,
	attachedImages: [],
	formatting: {
		link: false,
		bold: false,
		italic: false,
		underline: false,
		list: {
			bullet: false,
			ordered: false
		}
	}
};

export default function editor(state = initialState, { type, payload }) {
	switch (type) {
		case actions.SET_BUTTON_STATE:

			let buttonState = payload.state;

			if( _.isObject( initialState.formatting[payload.button] ) ){
				buttonState = {};

				Object.entries(initialState.formatting[payload.button]).forEach( pair => {
					buttonState[pair[0]] = false;
				});
				buttonState[payload.option] = payload.state;
			} 

			return {
				...state,
				formatting: {
					...state.formatting,
					[payload.button]: buttonState
				}
			};
		case actions.SET_FORMATTING:
			return {
				...state,
				formatting:	{
					...payload
				}
			};
		case actions.OPEN_LINK_MODAL:
			return {
				...state,
				linkModalActive: true
			};
		case actions.CLOSE_LINK_MODAL:
			return {
				...state,
				linkModalActive: false
			};
		case actions.OPEN_IMAGE_PICKER:
			return {
				...state,
				imagePickerOpened: true
			};
		case actions.RESET_IMAGE_PICKER:
			return {
				...state,
				imagePickerOpened: false
			};
		case actions.SET_FOCUS:
			return {
				...state,
				focused: payload.focused
			};
		case actions.RESET_EDITOR:
			return Object.assign({}, initialState);
		case actions.ADD_IMAGE_TO_UPLOAD:
			return {
				...state,
				attachedImages: [
					...state.attachedImages,
					{ 
						...payload,
						status: 'READY',
						progress: 0
					}
				]
			};
		default: 
			return state;
	}
}