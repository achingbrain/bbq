include(bbq.gui.form.TextField);

bbq.gui.form.PasswordField = new Class.create(bbq.gui.form.TextField, {
	initialize: function($super, args) {
		try {
			$super(args);

			this.setAttribute("type", "password");
		} catch(e) {
			Log.error("Error constructing EmailField", e);
		}
	}
});
