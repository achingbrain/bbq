include(bbq.web.Browser);

/**
 * Validates a field when blurred
 */
bbq.gui.form.behaviour.ValidateOnBlurBehaviour = new Class.create({

	initialize: function() {
		
	},

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
