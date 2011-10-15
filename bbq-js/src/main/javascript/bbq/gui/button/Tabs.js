include(bbq.gui.button.ButtonHolder);

/**
 * @class bbq.gui.button.Tabs 
 * @extends bbq.gui.button.ButtonHolder 
 */
bbq.gui.button.Tabs = Class.create(bbq.gui.button.ButtonHolder, {
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);

		this.addClass("Tabs");
	}
});
