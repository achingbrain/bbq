include(bbq.gui.form.validator.URLValidator);

test = new Test.Unit.Runner({

	testValidate: function() {
		with (this) {
			var validator = new bbq.gui.form.validator.URLValidator();

			this.assertNull(validator.validate("http://www.google.com"));
			this.assertNull(validator.validate(" ftp://foo "));
			this.assertNotNull(validator.validate("foo"));
		}
	}
});
