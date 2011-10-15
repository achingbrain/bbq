include(bbq.gui.form.transformer.BooleanValueTransformer);

test = new Test.Unit.Runner({

	testShim: function() {
		with (this) {
			var transformer = new bbq.gui.form.transformer.BooleanValueTransformer();

			this.assertEqual(true, transformer.transform("value"), "'value' should have been true");
			this.assertEqual(true, transformer.transform(true), "true should have been true");
			this.assertEqual(false, transformer.transform(""), "'' should have been false");
			this.assertEqual(false, transformer.transform("  "), "' ' should have been false");
			this.assertEqual(false, transformer.transform(null), "null should have been false");
			this.assertEqual(false, transformer.transform(false), "false should have been false");
		}
	}
});
