import moment from 'moment';

class RelativeTime {
	constructor() {
		this.second = 1e3;
		this.minute = 6e4;
		this.hour = 36e5;
		this.day = 864e5;
		this.week = 6048e5;
		this.month = this.day * 30;
		this.year = this.day * 365;

		this.formats = {
			seconds: {
				short: 's',
				long: ' sec'
			},
			minutes: {
				short: 'm',
				long: ' min'
			},
			hours: {
				short: 'h',
				long: ' hr'
			},
			days: {
				short: 'd',
				long: ' day'
			},
			weeks: {
				short: 'w',
				long: ' week'
			},
			months: {
				short: 'mo',
				long: ' month'
			},
			years: {
				short: 'y',
				long: ' year'
			}
		};
	};

	relativeFormat(timestamp, format) {
		let time = moment.unix(timestamp);
		let diff = Math.abs(moment().diff(time));
		let unit = null;
		let num = null;

		if (diff <= this.second) {
			unit = 'seconds';
			num = 1;
		} else if (diff < this.minute) {
			unit = 'seconds';
		} else if (diff < this.hour) {
			unit = 'minutes';
		} else if (diff < this.day) {
			unit = 'hours';
		} else if (diff < this.week) {
			unit = 'days';
		} else if (diff < this.month) {
			unit = 'weeks';
		} else if (diff < this.year) {
			unit = 'months';
		} else {
			unit = 'years';
		}

		if (!(num && unit)) {
			num = moment.duration(diff)[unit]();
		}
		
		unitStr = unit = this.formats[unit][format];
		
		if (format === 'long') {
			if (num > 1) {
				unitStr += 's';
			}

			unitStr += ' ago';
		}
		
		return num + unitStr;
	};

	short(timestamp) {
		return this.relativeFormat(timestamp, 'short');
	};

	long(timestamp) {
		return this.relativeFormat(timestamp, 'long');
	};
}

let relativeTime = new RelativeTime();
export default relativeTime;