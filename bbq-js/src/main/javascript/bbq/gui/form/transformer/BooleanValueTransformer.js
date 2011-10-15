
bbq.gui.form.transformer.BooleanValueTransformer = new Class.create({

	initialize: function() {

	},

	transform: function(value) {
		if(value && value.strip) {
			value = value.strip();
		}

		return value ? true : false;
	}
});
