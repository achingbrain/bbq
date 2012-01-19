include(bbq.gui.form.TextField);
include(bbq.gui.form.validator.EmailValidator);

bbq.gui.form.EmailField = new Class.create(bbq.gui.form.TextField, /** @lends bbq.gui.form.EmailField.prototype */ {
	/**
	 * @extends bbq.gui.form.TextField
	 * @param options
	 */
	initialize: function($super, options) {
		try {
			$super(options);

			this.addClass("EmailField");

			// Use HTML5 email type if supported
			if(Browser.forms.types.email) {
				this.setAttribute("type", "email");
			}

			// only accept valid emails
			this.addValidator(new bbq.gui.form.validator.EmailValidator());
		} catch(e) {
			Log.error("Error constructing EmailField", e);
		}
	}
});
