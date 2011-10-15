include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat1 represents US dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat1 = new Class.create(bbq.date.DateFormat, {
	_dateSeparator: "/",
	_timeSeparator: ":",
	
	_getDate: function(options) {
		return (options.date.getMonth() + 1) + this._dateSeparator + options.date.getDate() + this._dateSeparator + options.date.getFullYear();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Month", "DateSeparator", "Day", "DateSeparator", "Year"];
		}
		
		return ["Month", "DateSeparator", "Day", "DateSeparator", "Year", "BreakableSpace", "Hour", "TimeSeparator", "Minute"];
	}
});
