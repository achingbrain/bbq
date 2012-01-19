include(bbq.gui.form.TextField);

bbq.gui.form.PasswordField = new Class.create(bbq.gui.form.TextField, /** @lends bbq.gui.form.PasswordField */ {

	/**
	 * @constructs
	 * @extends bbq.gui.form.TextField
	 * @param $super
	 * @param options
	 */
	initialize: function($super, options) {
		try {
			$super(options);

			this.setAttribute("type", "password");
		} catch(e) {
			Log.error("Error constructing PasswordField", e);
		}
	}
});
