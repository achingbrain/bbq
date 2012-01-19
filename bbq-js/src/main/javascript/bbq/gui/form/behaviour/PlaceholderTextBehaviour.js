include(bbq.web.Browser);

bbq.gui.form.behaviour.PlaceholderTextBehaviour = new Class.create(/** @lends bbq.gui.form.behaviour.PlaceholderTextBehaviour.prototype */ {
	options: null,

	/**
	 * Adds the <a href="http://dev.w3.org/html5/spec/Overview.html#the-placeholder-attribute">placeholder</a>
	 * attribute to a form field or shims in support if placeholder is unsupported
	 *
	 * @constructs
	 * @param {Object} options
	 * @param {String} options.text The placeholder text
	 */
	initialize: function(options) {
		this.options = options;
	},

	/**
	 * Sets the field on which this behaviour operates
	 *
	 * @param {bbq.gui.form.FormField} field
	 */
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
