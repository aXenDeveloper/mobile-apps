import _ from "underscore";

class Lang {
	constructor() {
		this.words = {};
	}

	/**
	 * Populate the Lang class with our phrases
	 *
	 * @param 	object 	langPack 	Object of key:phrases
	 * @return 	void
	 */
	setWords(langPack) {
		this.words = {
			...this.words,
			...langPack
		};

		console.log( this.words );
	}

	/**
	 * Return a phrase
	 * Note: if the phrase doesn't exist, the key is returned, to prevent unnecessary errors
	 *
	 * @param 	string 		key 	Key of phrase to get
	 * @return 	string
	 */
	get(key) {
		if( !_.isUndefined( this.words[key] ) ){
			return this.words[key];
		}

		return key;
	}

	/**
	 * Pluralize the given phrase
	 *
	 * @param 	string 		word 	Phrase to parse
	 * @param 	array 		params 	Values to swap into the phrase
	 * @return 	string
	 */
	pluralize(word, params) {
		// Get the pluralization tags from it
		var i = 0;

		if (!_.isArray(params)) {
			params = [params];
		}

		word = word.replace(/\{(!|\d+?)?#(.*?)\}/g, function(a, b, c, d) {
			// {# [1:count][?:counts]}
			if (!b || b == "!") {
				b = i;
				i++;
			}

			var value;
			var fallback;
			var output = "";
			var replacement = params[b] + "";

			c.replace(/\[(.+?):(.+?)\]/g, function(w, x, y, z) {
				var xLen = x.length * -1;

				if (x == "?") {
					fallback = y.replace("#", replacement);
				} else if (x.charAt(0) == "%" && x.substring(1) == replacement.substring(0, x.substring(1).length)) {
					value = y.replace("#", replacement);
				} else if (x.charAt(0) == "*" && x.substring(1) == replacement.substr(-x.substring(1).length)) {
					value = y.replace("#", replacement);
				} else if (x == replacement) {
					value = y.replace("#", replacement);
				}
			});

			output = a.replace(/^\{/, "").replace(/\}$/, "").replace("!#", "");
			output = output.replace(b + "#", replacement).replace("#", replacement);
			output = output.replace(/\[.+\]/, value == null ? fallback : value).trim();

			return output;
		});

		return word;
	}
}

const langClass = new Lang();
export default langClass;