include(bbq.gui.form.RadioField);

test = new Test.Unit.Runner({
	field: null,

	setup: function() {
		with (this) {
			this.field = new bbq.gui.form.RadioField({
				name: "testField",
				options: [{
					key: "foo",
					value: "bar"
				}, {
					key: "baz",
					value: "qux"
				}],
				value: "bar"
			});
		}
	},

	teardown: function() {
		with (this) {

		}
	},

	testGetValue: function() {
		with (this) {
			this.assertEqual("bar", this.field.getValue());
		}
	},

	testSetValue: function() {
		with (this) {
			var value = "qux";

			this.field.setValue(value);

			var options = $A(this.field.getRootNode().getElementsByTagName("input"));

			// should have two input fields
			this.assertEqual(2, options.length, "Didn't have enough input fields");

			// the second should be selected
			this.assertNotEqual(1, options[0].value, "Field was checked when it shouldn't have been");
			this.assertEqual(1, options[1].value, "Field was not checked when it should have been");
		}
	},

	testGetValue_boolean: function() {
		with (this) {
			this.field = new bbq.gui.form.RadioField({
				name: "testField",
				options: [{
					key: "foo",
					value: true
				}, {
					key: "bar",
					value: false
				}],
				value: false
			});

			var options = $A(this.field.getRootNode().getElementsByTagName("input"));

			// should have two input fields
			this.assertEqual(2, options.length, "Didn't have enough input fields");

			// the second should be selected
			this.assertNotEqual(1, options[0].value, "Field was checked when it shouldn't have been");
			this.assertEqual(1, options[1].value, "Field was not checked when it should have been");
		}
	}
});
