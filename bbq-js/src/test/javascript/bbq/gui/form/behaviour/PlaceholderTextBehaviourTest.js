include(bbq.gui.form.behaviour.PlaceholderTextBehaviour);
include(bbq.gui.form.TextField);

test = new Test.Unit.Runner({

	testShim: function() {
		with (this) {
			var placeholderText = "foo";
			var behaviour = new bbq.gui.form.behaviour.PlaceholderTextBehaviour({text: placeholderText});
			var field = new bbq.gui.form.TextField();

			field.addBehaviour(behaviour);

			this.assertEqual(placeholderText, field.getRootNode().value);

			// focus field, then value should be blank
			field.getRootNode().focus();
			this.assertEqual("", field.getRootNode().value);

			// blur field, placeholder should return
			field.getRootNode().blur();
			this.assertEqual(placeholderText, field.getRootNode().value);

			// focus field, type something into it, blur field, new value should be respected
			var newValue = "bar";
			field.getRootNode().focus();
			field.getRootNode().value = newValue;
			field.getRootNode().blur();
			this.assertEqual(newValue, field.getRootNode().value);
		}
	}
});
