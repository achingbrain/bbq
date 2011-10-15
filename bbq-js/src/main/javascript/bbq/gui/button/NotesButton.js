include(bbq.gui.button.IconButton);

/**
 * @class bbq.gui.button.NotesButton 
 * @extends bbq.gui.button.IconButton 
 */
bbq.gui.button.NotesButton = Class.create(bbq.gui.button.IconButton, {
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("NotesButton");
	}
});
