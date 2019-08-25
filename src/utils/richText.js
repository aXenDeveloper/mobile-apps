const mentionRegex = /(<span contenteditable="false">(.+?)<\/span>)/gi;

export function processToSend(content) {
	// Mentions inserted by Quill have a special span around the inner text
	// to disable contenteditable. We need to remove that or IPS4 will strip
	// the whole mention
	content = content.replace(mentionRegex, (match, p1, p2) => {
		return p2.trim();
	});

	// Remove invisible chars that quill adds
	content = content.replace(/\uFEFF/g, "");

	return content;
}
