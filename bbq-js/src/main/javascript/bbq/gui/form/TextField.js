include(bbq.gui.form.FormField);

/**
 * Supports the following options:
 *
 * options: {
 *      value: String                   // initial value
 * }
 *
 * @class bbq.gui.form.TextField
 * @extends bbq.gui.form.FormField
 */
bbq.gui.form.TextField = new Class.create(bbq.gui.form.FormField, {
	_onKeyPressValue: null,
	_onKeyPressTimeOut: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this.addClass("TextField");

			this.getRootNode().type = "text";
			this.getRootNode().onkeydown = this._keyDown.bind(this);
			this.getRootNode().onkeyup = this._keyUp.bind(this);
		} catch(e) {
			Log.error("Error constructing TextField", e);
		}
	},

	_keyDown: function() {
		this._onKeyPressValue = this.getRootNode().value;
	},

	_keyUp: function() {
		if(this._onKeyPressValue != this.getRootNode().value) {
			// if the timeout already exists, cancel it so only one is dispatched
			if(this._onKeyPressTimeOut) {
				clearTimeout(this._onKeyPressTimeOut);
			}

			// Set a timeout so we only dispatch the event after editing has finished
			this._onKeyPressTimeOut = setTimeout(this.notifyListeners.bind(this, "onChange"), 500);
		}
	}
});
