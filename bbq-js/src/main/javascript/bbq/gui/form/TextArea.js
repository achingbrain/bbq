include(bbq.gui.form.FormField);

bbq.gui.form.TextArea = new Class.create(bbq.gui.form.FormField, /** @lends bbq.gui.form.TextArea.prototype */ {
	_onKeyPressValue: null,
	_onKeyPressTimeOut: null,

	/**
	 * @constructs
	 * @extends bbq.gui.form.FormField
	 */
	initialize: function($super, options) {
		try {
			$super(options);

			this.addClass("TextArea");

			this.setRootNode("textarea");
			this.getRootNode().onkeydown = this._keyDown.bind(this);
			this.getRootNode().onkeyup = this._keyUp.bind(this);
		} catch(e) {
			Log.error("Error constructing TextArea", e);
		}
	},

	_keyDown: function() {
		this._onKeyPressValue = this.getRootNode().value;
	},

	_keyUp: function() {
		if (this._onKeyPressValue != this.getRootNode().value) {
			// if the timeout already exists, cancel it so only one is dispatched
			if (this._onKeyPressTimeOut) {
				clearTimeout(this._onKeyPressTimeOut);
			}

			// Set a timeout so we only dispatch the event after editing has finished
			this._onKeyPressTimeOut = setTimeout(this.notifyListeners.bind(this, "onChange"), 500);
		}
	}
});
