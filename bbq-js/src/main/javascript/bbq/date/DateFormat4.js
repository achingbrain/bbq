include(bbq.date.DateFormat);

/**
 * @class bbq.date.DateFormat1 represents US dates
 * @extends bbq.date.DateFormat
 * 
 */
bbq.date.DateFormat4 = new Class.create(bbq.date.DateFormat, {
	_dateSeparator: " ",
	_timeSeparator: ":",
	
	getLongDate: function(options) {
		var offset = options.date.getTimezoneOffset()/60;
		
		if(offset > 0) {
			if(offset > 9) {
				offset = "+" + offset + "00";
			} else {
				offset = "+0" + offset + "00";
			}
		} else if(offset < 0) {
			if(offset < -9) {
				offset = "-" + Math.abs(offset) + "00";
			} else {
				offset = "-0" + Math.abs(offset) + "00";
			}
		} else {
			offset = "+0000";
		}
		
		return Language.get("bbq.date.DateFormat4.days" + options.date.getDay()).substr(0, 3) + ", " + this._getDate(options) + " " + this._getTime(options) + " " + offset;
	},
	
	getShortDate: function(options) {
		var string = this._getString(options);
		
		return (string ? string : this._getDate(options));
	},
	
	_getDate: function(options) {
		return options.date.getDate() + this._dateSeparator + Language.get("bbq.date.DateFormat4.months" + options.date.getMonth()).substr(0, 3) + this._dateSeparator + options.date.getFullYear();
	},
	
	getOrder: function(options) {
		if(options.shortDate) {
			return ["Year", "DateSeparator", "Month", "DateSeparator", "Day"];
		}
		
		return ["Year", "DateSeparator", "Month", "DateSeparator", "Day", "BreakableSpace", "Hour", "TimeSeparator", "Minute"];
	}
});
