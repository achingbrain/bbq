include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.form.validator.URLValidator
 */
bbq.gui.form.validator.URLValidator = new Class.create({

	initialize: function() {

	},

	validate: function(value) {
		if(value && value.indexOf("://") == -1) {
			return "url.invalid";
		}
	}
});
