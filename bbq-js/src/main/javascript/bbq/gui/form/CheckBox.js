include(bbq.gui.form.FormField);
include(bbq.gui.form.transformer.BooleanValueTransformer);

bbq.gui.form.CheckBox = new Class.create(bbq.gui.form.FormField, /** @lends bbq.gui.form.CheckBox.prototype */ {

	/**
	 * A check box.  By default has a BooleanValueTransformer applied to it.
	 *
	 * @constructs
	 * @extends bbq.gui.form.FormField
	 * @see bbq.gui.form.transformer.BooleanValueTransformer
	 */
	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("CheckBox");
			this.setAttribute("type", "checkbox");
			this.setValueTransformer(new bbq.gui.form.transformer.BooleanValueTransformer());
		} catch(e) {
			Log.error("Error constructing CheckBox", e);
		}
	},

	_getRawValue: function() {
		return this.getRootNode().checked ? true : false;
	},

	_setRawValue: function(value) {
		this.getRootNode().checked = (value ? true : false);
	}
});
