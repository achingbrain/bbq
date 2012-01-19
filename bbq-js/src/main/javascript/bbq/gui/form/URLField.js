include(bbq.gui.form.TextField);
include(bbq.gui.form.validator.URLValidator);

bbq.gui.form.URLField = new Class.create(bbq.gui.form.TextField, /** @lends bbq.gui.form.URLField */ {

	/**
	 * @constructs
	 * @extends bbq.gui.form.FormField
	 */
	initialize: function($super, options) {
		try {
			$super(options);

			this.addClass("URLField");

			// Use HTML5 url type if supported
			if(Browser.forms.types.url) {
				this.setAttribute("type", "url");
			}

			// only accept valid urls
			this.addValidator(new bbq.gui.form.validator.URLValidator());
		} catch(e) {
			Log.error("Error constructing URLField", e);
		}
	}
});
