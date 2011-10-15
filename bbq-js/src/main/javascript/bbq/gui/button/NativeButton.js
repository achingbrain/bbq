include(bbq.gui.button.GUIButton);

/** 
 * 
 * NativeButton
 * 
 * This class is similar to the GUIButton class but uses a standard browser submit input button as its
 * base.
 * 
 * @class bbq.gui.button.NativeButton
 * @extends bbq.gui.button.GUIButton 
 */
bbq.gui.button.NativeButton = Class.create(bbq.gui.button.GUIButton, {
	/**
	 * Supports the same options as bbq.gui.button.GUIButton
	 * @param {mixed} options
	 * @example 
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);

		this.addClass("NativeButton");
	},

	_setUpRootNode: function() {
		this.setRootNode("input");

		this.setAttribute("type", "submit");

		if (this.options.text) {
			this.setAttribute("value", this.options.text);
		}
	},

	/**
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		this._disabled = disabled;
		this.getRootNode().disabled = this.disabled;
	},

	setText: function(text) {
		this.setAttribue("value", text);
	}
});
