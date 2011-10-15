
bbq.gui.layout.Layout = new Class.create({
	_options: null,
	
	/**
	 * Constructor
	 * @param {Object} options
	 * 
	 * Supports the following options:
	 * 
	 * options {
	 * 		vertical: boolean	If this layout is attached to a panel with vertical orientation
	 * 		expands: boolean	If this layout is attached to a panel which should expand to fill all available space
	 * }
	 */
	initialize: function(options) {
		if(!options) {
			options = {
				vertical: true,
				expands: false
			};
		}
		
		this._options = options;
		
		if(Object.isUndefined(this._options.vertical)) {
			this._options.vertical = true;
		}
		
		if(Object.isUndefined(this._options.expands)) {
			this._options.expands = false;
		}
	},
	
	vertical: function() {
		return this._options.vertical;
	},
	
	setVertical: function(vertical) {
		this._options.vertical = vertical;
	},
	
	expands: function() {
		return this._options.expands;
	},
	
	setExpands: function(expands) {
		this._options.expands = expands;
	}
});