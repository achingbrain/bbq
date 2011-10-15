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
 */
bbq.gui.form.DateField = new Class.create(bbq.gui.form.FormField, {
	_date: null,
	
	initialize: function($super, args) {
		try {
			$super(args);

			this.setRootNode("fieldgroup");
			this.addClass("DateField");

			this._date = new Date();

			if (!Object.isUndefined(this.options.value)) {
				this.setValue(this.options.value);
			}
		} catch(e) {
			Log.error("Error constructing DateField", e);
		}
	},

	render: function($super) {
		$super();
		this.empty();

		var formatter = new bbq.gui.form.DateFieldFormatter({
			date: this._date,
			startYear: this.options.startYear,
			endYear: this.options.endYear
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
	_startYear: null,
	_endYear: null,

	initialize: function(args) {
		try {
			this._date = args.date || new Date();
			this._startYear = args.startYear || this._date.getFullYear() - 100;
			this._endYear = args.endYear || this._date.getFullYear() + 100;
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

		return fragment;
	},

	dd: function(date, utc, fragment) {
		var options = [];

		for(var i = 0; i < (32 - new Date(this._date.getFullYear(), this._date.getMonth(), 32).getDate()); i++) {
			options.push({
				key: "" + i,
				value: i
			});
		}

		var dropDown = new bbq.gui.form.DropDown({
			options: options,
			value: this._date.getDate(),
			onChange: function(field) {
				this._date.setDate(field.getValue());
			}.bind(this)
		});

		dropDown.appendTo(fragment);
	},

	mm: function(date, utc, fragment) {
		var options = [];

		for (var i = 0; i < (13 - new Date(this._date.getFullYear(), 13, 1).getMonth()); i++) {
			options.push({
				key: Language.get("bbq.date.DateFormatter.long.months" + i),
				value: i
			});
		}

		var dropDown = new bbq.gui.form.DropDown({
			options: options,
			value: this._date.getMonth(),
			onChange: function(field) {
				this._date.setMonth(field.getValue());
			}.bind(this)
		});

		dropDown.appendTo(fragment);
	},

	yyyy: function(date, utc, fragment) {
		var options = [];

		for(var i = this._startYear; i <= this._endYear; i++) {
			options.push({
				key: "" + i,
				value: i
			});
		}

		var dropDown = new bbq.gui.form.DropDown({
			options: options,
			value: this._date.getFullYear(),
			onChange: function(field) {
				this._date.setFullYear(field.getValue());
			}.bind(this)
		});

		dropDown.appendTo(fragment);
	}
});
