include(bbq.gui.button.IconButton);

/**
 * @class bbq.gui.button.IconButton 
 * @extends bbq.gui.button.GUIButton 
 */
bbq.gui.button.DatePickerButton = Class.create(bbq.gui.button.IconButton, {
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);

		this.addClass("DatePickerButton");
	}
});
