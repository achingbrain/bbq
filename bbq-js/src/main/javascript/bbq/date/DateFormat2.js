include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat1 represents US dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat2 = new Class.create(bbq.date.DateFormat, {
	_dateSeparator: ".",
	_timeSeparator: ":",
	
	_getDate: function(options) {
		return options.date.getDate() + this._dateSeparator + (options.date.getMonth() + 1) + this._dateSeparator + options.date.getFullYear();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Day", "DateSeparator", "Month", "DateSeparator", "Year"];
		}
		
		return ["Day", "DateSeparator", "Month", "DateSeparator", "Year", "BreakableSpace", "Hour", "TimeSeparator", "Minute"];
	}
});
