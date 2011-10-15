include(bbq.gui.FloatingWindow);

/**
 * @class bbq.gui.FloatingWindow
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.ModalWindow = new Class.create(bbq.gui.FloatingWindow, {
	/**
	 * @param {mixed} options
	 * @example	
	 * Supports the following options:
	 * 
	 * options: {
	 * 		showChrome: boolean						// Whether to be draggable, show close window button, etc
	 * }
	 * 
	 */
	initialize: function($super, options) {
		if(!options) {
			options = {};
		}
		
		options.modal = true;
		
		$super(options);
		
		this.addClass("ModalWindow");
		
		if(this.options.hideChrome) {
			// superclass adds chrome to window so get rid of it
			this.addClass("ModalWindow_withoutChrome");
		} else {
			this.addClass("ModalWindow_withChrome");
		}
		
		currentPage.addModalLayer(this);
	}
});