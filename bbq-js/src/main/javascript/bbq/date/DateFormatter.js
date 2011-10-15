/**
 * DateFormatter represents the date format
 *
 * Cribbed from http://blog.stevenlevithan.com/archives/date-time-format
 *
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
DateFormatter = {
	_token: /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	_timezone: /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	_timezoneClip: /[^-+\dA-Z]/g,

	masks: {
		"default":				"ddd mmm dd yyyy HH:MM:ss",
		shortDate:			"m/d/yy",
		mediumDate:		"mmm d, yyyy",
		longDate:				"mmmm d, yyyy",
		fullDate:				"dddd, mmmm d, yyyy",
		shortTime:			"h:MM TT",
		mediumTime:		"h:MM:ss TT",
		longTime:				"h:MM:ss TT Z",
		isoDate:				"yyyy-mm-dd",
		isoTime:				"HH:MM:ss",
		isoDateTime:		"yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime:	"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	},
	
	format: function(date, mask, formatter) {
		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();

		formatter = formatter || DateFormatter._stringFormatter;

		// blech, get out
		if(isNaN(date)) {
			throw SyntaxError("invalid date");
		}

		mask = new String(DateFormatter.masks[mask] || mask || DateFormatter.masks["default"]);

		var utc = false;

		// Allow setting the utc argument via the mask
		if(mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		return formatter.format(date, mask, utc, DateFormatter._token);
	}
}

DateFormatter._stringFormatter = {
	format: function(date, mask, utc, regex) {
		return mask.replace(regex, function ($0) {
			return this[$0] ? this[$0](date, utc) : $0.slice(1, $0.length - 1);
		}.bind(DateFormatter._stringFormatter));
	}.bind(DateFormatter._stringFormatter),

	d: function(date, utc) {
		return this._get(date, utc, "Date");
	}.bind(DateFormatter._stringFormatter),

	dd: function(date, utc) {
		return this.d(date, utc).toPaddedString(2);
	}.bind(DateFormatter._stringFormatter),

	ddd: function(date, utc) {
		return Language.get("bbq.date.DateFormatter.short.days" + this.D(date, utc));
	}.bind(DateFormatter._stringFormatter),

	dddd: function(date, utc) {
		return Language.get("bbq.date.DateFormatter.long.days" + this.D(date, utc));
	}.bind(DateFormatter._stringFormatter),

	D: function(date, utc) {
		return this._get(date, utc, "Day");
	}.bind(DateFormatter._stringFormatter),

	m: function(date, utc) {
		return this._get(date, utc, "Month") + 1;
	}.bind(DateFormatter._stringFormatter),

	mm: function(date, utc) {
		return this.m(date, utc).toPaddedString(2);
	}.bind(DateFormatter._stringFormatter),

	mmm: function(date, utc) {
		return Language.get("bbq.date.DateFormatter.short.months" + (this.m(date, utc) - 1));
	}.bind(DateFormatter._stringFormatter),

	mmmm: function(date, utc) {
		return Language.get("bbq.date.DateFormatter.long.months" + (this.m(date, utc) - 1));
	}.bind(DateFormatter._stringFormatter),

	_y: function(date, utc) {
		return this._get(date, utc, "FullYear");
	}.bind(DateFormatter._stringFormatter),

	yy: function(date, utc) {
		return String(this._y(date, utc)).slice(2);
	}.bind(DateFormatter._stringFormatter),

	yyyy: function(date, utc) {
		return this._y(date, utc);
	}.bind(DateFormatter._stringFormatter),

	h: function(date, utc) {
		return this.H(date, utc) % 12 || 12;
	}.bind(DateFormatter._stringFormatter),

	hh: function(date, utc) {
		return this.h(date, utc).toPaddedString(2);
	}.bind(DateFormatter._stringFormatter),

	H: function(date, utc) {
		return this._get(date, utc, "Hours");
	}.bind(DateFormatter._stringFormatter),

	HH: function(date, utc) {
		return this.H(date, utc).toPaddedString(2);
	}.bind(DateFormatter._stringFormatter),

	M: function(date, utc) {
		return this._get(date, utc, "Minutes");
	}.bind(DateFormatter._stringFormatter),

	MM: function(date, utc) {
		return this.M(date, utc).toPaddedString(2);
	}.bind(DateFormatter._stringFormatter),

	s: function(date, utc) {
		return this._get(date, utc, "Seconds");
	}.bind(DateFormatter._stringFormatter),

	ss: function(date, utc) {
		return this.s(date, utc).toPaddedString(2);
	}.bind(DateFormatter._stringFormatter),

	_ms: function(date, utc) {
		return this._get(date, utc, "Milliseconds");
	}.bind(DateFormatter._stringFormatter),

	l: function(date, utc) {
		return this._ms(date, utc).toPaddedString(3);
	}.bind(DateFormatter._stringFormatter),

	L: function(date, utc) {
		var ms = this._ms(date, utc);

		return ms.toPaddedString(ms > 99 ? Math.round(ms / 10) : ms);
	}.bind(DateFormatter._stringFormatter),

	t: function(date, utc) {
		return this.H(date, utc) < 12 ? "a" : "p";
	}.bind(DateFormatter._stringFormatter),

	tt: function(date, utc) {
		return this.H(date, utc) < 12 ? "am" : "pm";
	}.bind(DateFormatter._stringFormatter),

	T: function(date, utc) {
		return this.t(date, utc).toUpperCase();
	}.bind(DateFormatter._stringFormatter),

	TT: function(date, utc) {
		return this.tt(date, utc).toUpperCase();
	}.bind(DateFormatter._stringFormatter),

	Z: function(date, utc) {
		return  utc ? "UTC" : (String(date).match(DateFormatter._timezone) || [""]).pop().replace(DateFormatter._timezoneClip, "")
	}.bind(DateFormatter._stringFormatter),

	o: function(date, utc) {
		var o = utc ? 0 : date.getTimezoneOffset();
		return (o > 0 ? "-" : "+") + (Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60,4).toPaddedString(2);
	},

	S: function(date, utc) {
		var d = this.d(date, utc);
		return ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10];
	},

	_get: function(date, utc, property) {
		return date["get" + (utc ? "UTC" : "") + property]();
	}.bind(DateFormatter._stringFormatter)
};

// For convenience...
Date.prototype.format = function(mask, formatter) {
	return DateFormatter.format(this, mask, formatter);
};
