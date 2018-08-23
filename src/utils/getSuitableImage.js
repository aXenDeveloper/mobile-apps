import _ from "underscore";

export default function getSuitableImage(data) {
	/*let imageToUse = false;
	for( let i = 0; i < data.length; i++ ){
		if( data[i].indexOf('https') === 0 ){
			imageToUse = data[i];
			break;
		}
	}
	return imageToUse;*/

	return data !== null && data.length ? data[0] : false;	
}