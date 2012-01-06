include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.form.validator.EmailValidator
 */
bbq.gui.form.validator.EmailValidator = new Class.create({

	initialize: function() {

	},

	validate: function(value) {
		if(value && !BBQUtil.isValidEmail(value)) {
			return "email.invalid";
		}
	}
});
