import supported from '../supportedTypes'
import _ from "underscore";

/**
 * Checks the provided classname against our supported list
 *
 * @param 	string 	className 	Classname to check
 * @return 	boolean
 */
export function isSupportedType(className) {
	const fixedClassName = className.replace("\\\\", "\\", 'g');
	return supported.classes.indexOf( fixedClassName ) !== -1;
}

/**
 * Checks the provided URL array against our supported list
 *
 * @param 	array 	url 	Array of [app, module, controller]
 * @return 	boolean
 */
export function isSupportedUrl(url) {
	let currentPiece = supported.urls;
	let renderComponent = true;

	for( let i = 0; i < url.length; i++ ){
		if( !_.isUndefined( currentPiece[ url[i] ] ) && currentPiece[ url[i] ] !== false ){
			if( _.isObject( currentPiece[ url[i] ] ) ){
				currentPiece = currentPiece[ url[i] ];
				continue;
			} else {
				renderComponent = currentPiece[ url[i] ];
				break;
			}
		}
		return false;
	};

	return renderComponent;
}