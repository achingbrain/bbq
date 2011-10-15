include(bbq.gui.form.validator.NotNullValidator);

test = new Test.Unit.Runner({

	testValidate: function() {
		with (this) {
			var validator = new bbq.gui.form.validator.NotNullValidator();

			this.assertNull(validator.validate("value"));
			this.assertNull(validator.validate(" value "));
			this.assertNotNull(validator.validate());
			this.assertNotNull(validator.validate(null));
			this.assertNotNull(validator.validate(""));
			this.assertNotNull(validator.validate(" "));
			this.assertNotNull(validator.validate(" "));
		}
	}
});
