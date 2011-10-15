include(bbq.gui.button.GUIButton);

/**
 * @class bbq.gui.button.IconButton 
 * @extends bbq.gui.button.GUIButton 
 */
bbq.gui.button.IconButton = Class.create(bbq.gui.button.GUIButton, {
	/**
	 * @param {mixed} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);

		this.addClass("IconButton");
	}
});
