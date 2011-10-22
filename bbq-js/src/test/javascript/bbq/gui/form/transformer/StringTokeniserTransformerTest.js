include(bbq.gui.form.transformer.StringTokeniserTransformer);

test = new Test.Unit.Runner({

	testTransform: function() {
		with (this) {
			var transformer = new bbq.gui.form.transformer.StringTokeniserTransformer();

			var expected = ["one", "two", "three"];

			transformer.transform("one, two, three").each(function(foo, index) {
				this.assertEqual(foo, expected[index], "Didn't transform properly with default settings");
			}.bind(this));

			transformer = new bbq.gui.form.transformer.StringTokeniserTransformer({delimiter: "-", space: ""});

			transformer.transform("one-two-three").each(function(foo, index) {
				this.assertEqual(foo, expected[index], "Didn't transform properly with dashes and no spaces");
			}.bind(this));
		}
	},

	testTransform_emptyString: function() {
		with (this) {
			var transformer = new bbq.gui.form.transformer.StringTokeniserTransformer();

			this.assertEqual(0, transformer.transform("").length, "Turned empty string into token");
			this.assertEqual(0, transformer.transform(" ").length, "Turned white space into token");
		}
	},

	testDeTransform: function() {
		with (this) {
			var transformer = new bbq.gui.form.transformer.StringTokeniserTransformer();

			this.assertEqual("one, two, three", transformer.deTransform(["one", "two", "three"]), "Didn't de-transform properly with default settings");

			transformer = new bbq.gui.form.transformer.StringTokeniserTransformer({delimiter: "-", space: ""});

			this.assertEqual("one-two-three", transformer.deTransform(["one", "two", "three"]), "Didn't de-transform properly with dashes and no spaces");
		}
	}
});
