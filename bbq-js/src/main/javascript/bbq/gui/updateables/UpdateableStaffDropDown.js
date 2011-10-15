include(bbq.gui.updateables.UpdateableDropDown);

/**
 * @class bbq.gui.updateables.UpdateableStaffDropDown
 * @extends bbq.gui.updateables.UpdateableDropDown
 */
bbq.gui.updateables.UpdateableStaffDropDown = new Class.create(bbq.gui.updateables.UpdateableDropDown, {
	_tree: null,
	
	/**
	 * 
	 * Supports the folloing options:
	 * 
	 * options: {
	 * 		initialValue: int
	 * 		keys: Array
	 * 		tree: Array
	 * }
	 * 
	 * Supports the following callbacks
	 * 
	 * onchange
	 * 
	 * @param {Object} options
	 * 
	 * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._tree = this.options.tree;
	},
	
	/**
	 * @return {GUID} Returns staff id
	 */
	getValue: function(supressErrorWarning) {
		return this._tree[this.currentValue];
	}
});
