include(bbq.gui.GUIWidget);
include(bbq.gui.PickableCalendar);
include(bbq.gui.FloatingWindow);

/**
 * @class bbq.gui.DatePicker
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.DatePicker = new Class.create(bbq.gui.FloatingWindow, {
	
	_floatingWindow: null,
	_calendar: null,
	_dateController: null,
	
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
		options.nearPointer = true;
		
		$super(options);
		
		if(!(this.options.startDate instanceof Date)) {
			this.options.startDate = new Date(this.options.startDate);
		}
		
		this._calendar = new bbq.gui.PickableCalendar({owner: this, startDate: this.options.startDate, showStartDate: this.options.showStartDate});
		
		this.setWindowTitle(this.options.title);
		this.setContent(this._calendar);
		
		this.registerListener("onWindowClosed", function() {
			this.options.owner.datePicked();
		}.bind(this));
		
		this._calendar.registerListener("onMonthChanged", function() {
			var dims = Element.getDimensions(this._calendar.getRootNode().getElementsByTagName("table")[0]);
			this.setWindowSize(this.options.width, dims.height + 30, 0.2);
		}.bind(this));
	},
	
	appear: function($super) {
		$super();
		
		var dims = Element.getDimensions(this.getRootNode());
		this.options.width = dims.width;
		this.options.height = dims.height;
	},
	
	datePicked: function(date) {
		this.disappear();
		this.options.owner.datePicked(date);
	}
});
