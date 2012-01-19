include(bbq.gui.form.FormField);
include(bbq.gui.form.DropDown);
include(bbq.date.DateFormatter);

/**
 * Supports the following options:
 *
 * options: {
 *      options: [
 *          key: String
 *          value: Object
 *      ]
 * }
 *
 * @class bbq.gui.form.DateField
 * @extends bbq.gui.form.FormField
 */
bbq.gui.form.DateField = new Class.create(bbq.gui.form.FormField, /** @lends bbq.gui.form.DateField */ {
	_date: null,

	/**
	 * @constructs
	 * @extends bbq.gui.form.FormField
	 * @param {Object} options
	 * @param {Date} [options.before]
	 * @param {Date} [options.after]
	 * @param {Boolean} [options.acceptNull]
	 */
	initialize: function($super, options) {
		try {
			$super(options);

			this.setRootNode("fieldset");
			this.addClass("DateField");
		} catch(e) {
			Log.error("Error constructing DateField", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		var formatter = new bbq.gui.form.DateFieldFormatter({
			date: this._date,
			after: this.options.after,
			before: this.options.before,
			acceptNull: this.options.acceptNull,
			onChange: function(date) {
				this._date = date;
			}.bind(this)
		});

		this.appendChild(DateFormatter.format(this._date, "dd mm yyyy", formatter));
	},

	_getRawValue: function() {
		return this._date;
	},

	_setRawValue: function(value) {
		this._date = value;
	}
});

bbq.gui.form.DateFieldFormatter = new Class.create({
	_date: null,
	_after: null,
	_before: null,
	_acceptNull: null,
	_dayDropDown: null,
	_monthDropDown: null,
	_yearDropDown: null,
	_onChange: null,
	_passedNullDate: null,

	initialize: function(args) {
		try {
			this._date = args.date || new Date();
			this._after = args.after || this._date.getFullYear() - 100;
			this._before = args.before || this._date.getFullYear() + 100;
			this._acceptNull = args.acceptNull ? true : false;
			this._onChange = args.onChange || function(){};

			this._passedNullDate = args.date == null;
		} catch(e) {
			Log.error("Error constructing DateFieldFormatter", e);
		}
	},

	format: function(date, mask, utc, regex) {
		var fragment = document.createDocumentFragment();

		mask.replace(regex, function ($0) {
			if(this[$0]) {
				this[$0](date, utc, fragment);
			} else {
				fragment.appendChild(document.createTextElement(" "));
			}

			return "";
		}.bind(this));

		if(this._passedNullDate) {
			// initially, show null date
			this._dayDropDown.setValue(null);
			this._monthDropDown.setValue(null);
			this._yearDropDown.setValue(null);

			// make sure next time we don't blank out the date
			this._passedNullDate = false;
		}

		return fragment;
	},

	dd: function(date, utc, fragment) {
		this._dayDropDown = new bbq.gui.form.DropDown({
			options: this._getDays(),
			value: this._date.getDate(),
			onChange: function(field) {
				if (field.getValue() === null) {
					// show empty fields
					this._dayDropDown.setValue(null);
					this._monthDropDown.setValue(null);
					this._yearDropDown.setValue(null);

					// notify the listener
					this._onChange(null);

					return;
				}

				// save the value
				this._date.setDate(field.getValue());

				// if a null date has previously been selected, we need to update the other drop downs
				this._monthDropDown.setValue(this._date.getMonth());
				this._yearDropDown.setValue(this._date.getFullYear());

				// notify the listener
				this._onChange(this._date);
			}.bind(this)
		});

		this._dayDropDown.appendTo(fragment);
	},

	mm: function(date, utc, fragment) {
		this._monthDropDown = new bbq.gui.form.DropDown({
			options: this._getMonths(),
			value: this._date.getMonth(),
			onChange: function(field) {
				if(field.getValue() === null) {
					// show empty fields
					this._dayDropDown.setValue(null);
					this._monthDropDown.setValue(null);
					this._yearDropDown.setValue(null);

					// notify the listener
					this._onChange(null);

					return;
				}

				// make sure the new date is valid for the selected month
				var newDate = new Date();
				newDate.setDate(1);
				newDate.setMonth(field.getValue());

				var daysInMonth = newDate.getDaysInMonth();

				if(this._date.getDate() > daysInMonth) {
					// eg. had 31st, but gone to a 30 day month
					this._date.setDate(1);
				}

				// save the value
				this._date.setMonth(field.getValue());

				// redraw so the days in the month change
				this._dayDropDown.setOptions(this._getDays());

				// if a null date has previously been selected, we need to update the other drop downs
				this._dayDropDown.setValue(this._date.getDate());
				this._yearDropDown.setValue(this._date.getFullYear());

				// notify the listener
				this._onChange(this._date);
			}.bind(this)
		});

		this._monthDropDown.appendTo(fragment);
	},

	yyyy: function(date, utc, fragment) {
		this._yearDropDown = new bbq.gui.form.DropDown({
			options: this._getYears(),
			value: this._date.getFullYear(),
			onChange: function(field) {
				if(field.getValue() === null) {
					// show empty fields
					this._dayDropDown.setValue(null);
					this._monthDropDown.setValue(null);
					this._yearDropDown.setValue(null);

					// notify the listener
					this._onChange(null);

					return;
				}

				var daysInOldMonth = this._date.getDaysInMonth();

				var newDate = new Date();
				newDate.setDate(1);
				newDate.setMonth(this._date.getMonth());
				newDate.setFullYear(field.getValue());

				var leapYearToNonLeapYear = false;

				if (newDate.getMonth() == 1) {
					// feburary, 0 indexed

					// gone from leap year to non-leap year or vice versa
					if(newDate.getDaysInMonth() != daysInOldMonth) {
						leapYearToNonLeapYear = true;

						if(this._date.getDate() >= newDate.getDaysInMonth()) {
							// eg. had 29th, but gone to a 28 day month
							this._date.setDate(1);
						}
					}
				}

				// save the value
				this._date.setFullYear(field.getValue());

				if(leapYearToNonLeapYear) {
					// redraw so the days to show new length
					this._dayDropDown.setOptions(this._getDays());
				}

				// if a null date has previously been selected, we need to update the other drop downs
				this._dayDropDown.setValue(this._date.getDate());
				this._monthDropDown.setValue(this._date.getMonth());

				// notify the listener
				this._onChange(this._date);
			}.bind(this)
		});

		this._yearDropDown.appendTo(fragment);
	},

	// returns a list of day options
	_getDays: function() {
		var options = [];

		if(this._acceptNull) {
			options.push({
				key: " ",
				value: null
			});
		}

		var startDate = 1;
		var endDate = this._date.getDaysInMonth();

		for (var i = startDate; i <= endDate; i++) {
			options.push({
				key: "" + i,    // coerce to a string otherwise the value will not appear in the option tag
				value: i
			});
		}

		return options;
	},

	// returns a list of month options
	_getMonths: function() {
		var options = [];

		if (this._acceptNull) {
			options.push({
				key: " ",
				value: null
			});
		}

		var startMonth = 0;
		var endMonth = 12;

		for (var i = startMonth; i < endMonth; i++) {
			options.push({
				key: Language.get("bbq.date.DateFormatter.long.months" + i),
				value: i
			});
		}

		return options;
	},

	// returns a list of year options
	_getYears: function() {
		var options = [];

		if (this._acceptNull) {
			options.push({
				key: " ",
				value: null
			});
		}

		var startYear = this._after.getFullYear();
		var endYear = this._before.getFullYear();

		for (var i = startYear; i <= endYear; i++) {
			options.push({
				key: "" + i,    // coerce to a string otherwise the value will not appear in the option tag
				value: i
			});
		}

		return options;
	}
});

Date.prototype.getDaysInMonth = function(utc) {
	var m = utc ? this.getUTCMonth() : this.getMonth();
	// If feb.
	if (m == 1)
		return this.isLeapYear() ? 29 : 28;
	// If Apr, Jun, Sep or Nov return 30; otherwise 31
	return (m == 3 || m == 5 || m == 8 || m == 10) ? 30 : 31;
};

Date.prototype.isLeapYear = function(utc) {
	var y = utc ? this.getUTCFullYear() : this.getFullYear();
	return !(y % 4) && (y % 100) || !(y % 400) ? true : false;
};
