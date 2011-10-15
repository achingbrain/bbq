include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat1 represents US dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat3 = new Class.create(bbq.date.DateFormat, {
	_dateSeparator: "-",
	_timeSeparator: ":",
	
	_getDate: function(options) {
		return options.date.getFullYear() + this._dateSeparator + (options.date.getMonth() + 1) + this._dateSeparator + options.date.getDate();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Year", "DateSeparator", "Month", "DateSeparator", "Day"];
		}
		
		return ["Year", "DateSeparator", "Month", "DateSeparator", "Day", "BreakableSpace", "Hour", "TimeSeparator", "Minute"];
	}
});
