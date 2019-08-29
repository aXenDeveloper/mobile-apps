import moment from "moment";
import _ from "underscore";

class Lang {
	constructor() {
		this.words = {};

		// Set up mustache-style templates for language interpolation in underscore
		_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g
		};
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
	}

	/**
	 * Return a phrase
	 * Note: if the phrase doesn't exist, the key is returned, to prevent unnecessary errors
	 *
	 * @param 	string 		key 	Key of phrase to get
	 * @return 	string
	 */
	get(key, replacements = {}) {
		if (!_.isUndefined(this.words[key])) {
			if (this.words[key].indexOf("{{") === -1) {
				return this.words[key];
			}
			return _.template(this.words[key])(replacements);
		} else {
			return (
				key +
				Object.values(replacements)
					.map(val => `(${val})`)
					.join(" ")
			);
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

		// If there's no pluralization brackets in this word, then manually append a pattern
		// As well as being a fallback, this will help in tests
		if (word.indexOf("{") === -1) {
			word = word + params.map((val, idx) => `{!# [?:(${val})]}`).join(" ");
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

			output = a
				.replace(/^\{/, "")
				.replace(/\}$/, "")
				.replace("!#", "");
			output = output.replace(b + "#", replacement).replace("#", replacement);
			output = output.replace(/\[.+\]/, value == null ? fallback : value).trim();

			return output;
		});

		return word;
	}

	/**
	 * When provided with a search result object, this method will return the action string
	 * e.g. 'Dave replied to a topic' or 'Susan posted a gallery image'.
	 *
	 * @param 	boolean 		isComment 				Is this content a comment?
	 * @param 	boolean 		isReview 				Is this content a review?
	 * @param 	boolean			firstCommentRequired	Does the content container require a first comment (e.g. like a forum)
	 * @param 	string 			user					Username to sprintf
	 * @param 	object 			articleLang				Object containing words for indef article, def article etc.
	 * @return 	string
	 */
	buildActionString(isComment = false, isReview = false, firstCommentRequired = false, user, articleLang) {
		// Check we have the required data
		if (_.isUndefined(articleLang)) {
			return this.get("activity_generic");
		}

		try {
			let langKey;

			if (isComment) {
				if (firstCommentRequired) {
					langKey = "activity_replied";
				} else {
					langKey = "activity_commented";
				}
			} else if (isReview) {
				langKey = "activity_reviewed";
			} else {
				langKey = "activity_posted_item";
			}

			return this.get(langKey, { user, article: articleLang.indefinite });
		} catch (err) {
			return this.get("activity_generic");
		}
	}

	static second = 1e3;
	static minute = 6e4;
	static hour = 36e5;
	static day = 864e5;
	static week = 6048e5;
	static month = 2592e6;
	static year = 31536e6;

	formatTime(time, format = "long", showSuffix = true) {
		if (!_.isNumber(time) || _.isNaN(time)) {
			if (!_.isString(time) || time.length !== 10) {
				throw new Error("Invalid timestamp passed to Lang.formatTime");
			}
		}

		const timeObj = moment.unix(parseInt(time));
		const diff = moment().diff(timeObj);
		let unit;
		let num;
		let future = false;

		if (diff < 0) {
			future = true;
			diff = diff * -1;
		}

		if (diff < Lang.second) {
			unit = "seconds";
			num = 1;
		} else if (diff < Lang.minute) {
			unit = "seconds";
		} else if (diff < Lang.hour) {
			unit = "minutes";
		} else if (diff < Lang.day) {
			unit = "hours";
		} else if (diff < Lang.week) {
			unit = "days";
		} else if (diff < Lang.month) {
			unit = "weeks";
		} else if (diff < Lang.year) {
			unit = "months";
		} else {
			unit = "years";
		}

		num = Math.max(1, moment.duration(diff)[unit]());

		if (format === "short") {
			return this.pluralize(this.get(`${unit}_short`), num);
		} else if (format === "long") {
			const val = this.pluralize(this.get(unit), num);

			if (showSuffix) {
				if (future) {
					return this.get("time_future", { val });
				} else {
					return this.get("time_past", { val });
				}
			} else {
				return pluralizedString;
			}
		}
	}
}

const langClass = new Lang();
export default langClass;
