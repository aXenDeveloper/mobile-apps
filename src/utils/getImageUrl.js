import _ from "underscore";

export default function getImageUrl(url) {
	if (url.indexOf("//") === 0) {
		return `https:${url}`;
	}

	return url;
}
