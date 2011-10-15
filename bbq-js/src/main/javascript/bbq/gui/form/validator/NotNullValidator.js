
bbq.gui.form.validator.NotNullValidator = new Class.create({

	initialize: function() {

	},

	validate: function(value) {
		if(!value) {
			return "value.was.null";
		}

		if(value.strip && !value.strip()) {
			return "value.was.null";
		}
	}
});
