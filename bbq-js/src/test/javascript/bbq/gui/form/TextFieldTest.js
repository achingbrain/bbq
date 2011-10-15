include(bbq.gui.form.TextField);

test = new Test.Unit.Runner({
	field: null,

	setup: function() {
		with (this) {
			this.field = new bbq.gui.form.TextField();
		}
	},

	teardown: function() {
		with (this) {

		}
	},

	testGetValue: function() {
		with (this) {
			var value = "foo";

			this.field.getRootNode().value = value;


			this.assertEqual(value, this.field.getValue());
		}
	}
});
