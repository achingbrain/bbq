include(bbq.gui.form.TextField);
include(bbq.gui.form.validator.EmailValidator);

bbq.gui.form.EmailField = new Class.create(bbq.gui.form.TextField, {
	initialize: function($super, args) {
		try {
			$super(args);

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
