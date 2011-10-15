include(bbq.gui.form.validator.EmailValidator);

test = new Test.Unit.Runner({

	testValidate: function() {
		with (this) {
			var validator = new bbq.gui.form.validator.EmailValidator();

			this.assertNull(validator.validate("foo@bar.com"));
			this.assertNull(validator.validate(" foo@bar.com "));
			this.assertNotNull(validator.validate("foo"));
		}
	}
});
