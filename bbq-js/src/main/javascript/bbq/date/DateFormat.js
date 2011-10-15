
DateFormat = {
	Day: "Day",
	Month: "Month",
	Year: "Year",
	Hour: "Hour",
	Minute: "Minute",
	DateSeparator: "DateSeparator",
	TimeSeparator: "TimeSeparator",
	BreakableSpace: "BreakableSpace"
};

/**
 * @class bbq.date.DateFormat
  */
bbq.date.DateFormat = new Class.create({
	_getString: function(options) {
		var now = new Date();

		if(options.withStrings) {
			if(options.date.getFullYear() == now.getFullYear() && 
					options.date.getMonth == now.getMonth() && 
					options.date.getDay() == now.getDay()) {
				return Language.get("bbq.date.DateFormat.today");
			}

			var modDate = new Date(options.date.getTime() - 86400000);

			if(modDate.getFullYear() == now.getFullYear() && 
					modDate.getMonth == now.getMonth() && 
					modDate.getDay() == now.getDay()) {
				return Language.get("bbq.date.DateFormat.tomorrow");
			}

			modDate = new Date(options.date.getTime() + 86400000);

			if(modDate.getFullYear() == now.getFullYear() && 
					modDate.getMonth == now.getMonth() && 
					modDate.getDay() == now.getDay()) {
				return Language.get("bbq.date.DateFormat.yesterday");
			}
		}

		return false;
	},

	getDate: function(options) {
		var output = this._getString(options);

		if(output) {
			return output;
		}

		output = "";

		this.getDateOrder().each(function() {

		});

		return (string ? string : this._getDate(options)) + " " + this._getTime(options);
	},

	getLongDate: function(options) {
		var string = this._getString(options);

		return (string ? string : this._getDate(options)) + " " + this._getTime(options);
	},

	getShortDate: function(options) {
		var string = this._getString(options);

		return (string ? string : this._getDate(options));
	},

	_getTime: function(options) {
		return options.date.getHours() + this._timeSeparator + (options.date.getMinutes() < 10 ? "0" : "") +  options.date.getMinutes();
	}
});
