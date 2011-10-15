include(bbq.gui.form.PasswordField);

test = new Test.Unit.Runner({

	testPasswordField: function() {
		with (this) {
			var field = new bbq.gui.form.PasswordField();

			this.assertEqual("password", field.getRootNode().type);
		}
	}
});
