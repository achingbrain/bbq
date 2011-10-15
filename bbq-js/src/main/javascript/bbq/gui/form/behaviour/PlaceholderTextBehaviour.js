include(bbq.web.Browser);

/**
 * Supports the following options:
 *
 * options: {
 *      text: String                                     // the placeholder text
 * }
 */
bbq.gui.form.behaviour.PlaceholderTextBehaviour = new Class.create({
	options: null,

	initialize: function(options) {
		this.options = options;
	},

	setField: function(field) {
		// respect HTML5 style placeholder
		if(Browser.forms.placeholderText) {
			field.setAttribute("placeholder", this.options.text);

			return;
		}

		// shim in placeholder for non-HTML5 browsers
		if(!field.getRootNode().value) {
			field.getRootNode().value = this.options.text;
			field.addClass("placeholderText");
		}

		Event.observe(field.getRootNode(), "focus", function() {
			if(field.getRootNode().value == this.options.text) {
				field.getRootNode().value = "";
				field.removeClass("placeholderText");
			}
		}.bind(this));

		Event.observe(field.getRootNode(), "blur", function() {
			if(!field.getRootNode().value) {
				field.getRootNode().value = this.options.text;
				field.addClass("placeholderText");
			}
		}.bind(this));
	}
});
