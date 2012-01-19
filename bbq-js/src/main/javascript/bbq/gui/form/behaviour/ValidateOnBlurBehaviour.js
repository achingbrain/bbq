include(bbq.web.Browser);

bbq.gui.form.behaviour.ValidateOnBlurBehaviour = new Class.create(/** @lends bbq.gui.form.behaviour.ValidateOnBlurBehaviour.prototype */ {

	/**
	 * Causes validation of the field's value to occur then it loses focus.
	 *
	 * @constructs
	 */
	initialize: function() {
		
	},

	/**
	 * Sets the field on which this behaviour operates
	 *
	 * @param {bbq.gui.form.FormField} field
	 */
	setField: function(field) {
		Element.observe(field.getRootNode(), "blur", function() {
			try {
				field.getValue();
			} catch(e) {
				Log.info("error while blurring", e);
			}
		});
	}
});
