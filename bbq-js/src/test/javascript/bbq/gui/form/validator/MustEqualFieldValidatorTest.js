include(bbq.gui.form.validator.MustEqualFieldValidator);
include(bbq.gui.form.TextField);

test = new Test.Unit.Runner({

	testValidate: function() {
		with (this) {
			var field = new bbq.gui.form.TextField({
				value: "foo"
			});
			var validator = new bbq.gui.form.validator.MustEqualFieldValidator(field);

			this.assertNull(validator.validate("foo"));
			this.assertNotNull(validator.validate("bar"));
		}
	},

	testTransitiveValidation: function() {
		with (this) {
			var field1 = new bbq.gui.form.TextField({
				value: "foo"
			});

			var field2 = new bbq.gui.form.TextField({
				value: "foo"
			});

			var validator = new bbq.gui.form.validator.MustEqualFieldValidator(field1);
			field2.addValidator(validator);

			field1.addValidator(new bbq.gui.form.validator.MustEqualFieldValidator(field2));

			this.assertNull(validator.validate("foo"));
			this.assertNotNull(validator.validate("bar"));

			// make sure validators function correctly
			this.assertEqual(field1.getValue(), field2.getValue());
		}
	}
});
