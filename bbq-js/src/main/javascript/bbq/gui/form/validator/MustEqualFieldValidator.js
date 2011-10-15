
bbq.gui.form.validator.MustEqualFieldValidator = new Class.create({
	_field: null,

	initialize: function(field) {
		this._field = field;
	},

	validate: function(value) {
		var other = this._field.getUnvalidatedValue();

		if(value != other) {
			return "does.not.match";
		}
	}
});
