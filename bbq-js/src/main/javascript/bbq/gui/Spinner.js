include(bbq.gui.GUIWidget);

/**
 * @class bbq.gui.Spinner
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.Spinner = new Class.create(bbq.gui.GUIWidget, {
	
	_disabled: null,
	_spinner: null,
	
	/**
	 * @param {mixed} options
	 * @example
	 * Supports the following options
	 * 
	 * options: {
	 * 		owner: Object				// should have the method datePicked(Date:date)
	 * 		title:		String					// window title
	 * 		startDate:	Date			// initially selected date
	 * 		pointerEvent: Event		// the mouse click that opened the window
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("Spinner");
		
		this.setStyle("display", "none");
	},
	
	render: function() {
		this.empty();
	},
	
	setVisible: function(visible) {
		if(visible) {
			Effect.Appear(this.getRootNode());
		} else {
			this.setStyle("display", "none");
		}
	},
	
	setStatusText: function(text) {
		this.render();
	}
});
