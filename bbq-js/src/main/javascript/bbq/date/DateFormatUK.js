include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormatUK represents UK dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormatUK = new Class.create(bbq.date.DateFormat, {
	_getDateSeparator: function() {
		return "/";
	},

	_getTimeSeparator: function() {
		return ":";
	},

	getDateOrder: function(options) {
		return [
			DateFormat.Day,
			DateFormat.DateSeparator,
			DateFormat.Month,
			DateFormat.DateSeparator,
			DateFormat.Year
		];
	},

	getTimeOrder: function(options) {
		return [
			DateFormat.Hour,
			DateFormat.TimeSeparator,
			DateFormat.Minute
		];
	},

	getDateTimeOrder: function(options) {
		return [
			DateFormat.Day,
			DateFormat.DateSeparator,
			DateFormat.Month,
			DateFormat.DateSeparator,
			DateFormat.Year,
			DateFormat.BreakableSpace,
			DateFormat.Hour,
			DateFormat.TimeSeparator,
			DateFormat.Minute
		];
	}
});
