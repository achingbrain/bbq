include(bbq.gui.button.IconButton);

/**
 * @class bbq.gui.button.TickButton 
 * @extends bbq.gui.button.IconButton 
 */
bbq.gui.button.TickButton = Class.create(bbq.gui.button.IconButton, {
	_checked: false,

	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);

		this.addClass("TickButton");
		this._checked = this.options.checked ? true : false;
		this._updateCheckedState();
	},

	setChecked: function(checked) {
		this._checked = checked;
		this._updateCheckedState();
	},

	_updateCheckedState: function() {
		if(this._checked) {
			this.addClass("TickButton_Checked")
		} else {
			this.removeClass("TickButton_Checked");
		}
	}
});
