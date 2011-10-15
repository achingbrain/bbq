include(bbq.gui.form.EmailField);

test = new Test.Unit.Runner({

	testEmailValidation: function() {
		with(this) {
			var field = new bbq.gui.form.EmailField();

			field.getRootNode().value = "foo";

			try {
				field.getValue();
				this.fail("Did not notice invalid email");
			} catch(e) {

			}

			field.getRootNode().value = "foo@bar.com";

			try {
				field.getValue();
			} catch(e) {
				this.fail("Thought valid email was invalid " + e);
			}
		}
	}
});
