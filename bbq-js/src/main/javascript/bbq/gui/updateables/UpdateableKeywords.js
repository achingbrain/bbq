include(bbq.gui.updateables.UpdateableTokenField);

/**
 * @class bbq.gui.updateables.UpdateableKeywords
 * @extends bbq.gui.updateables.UpdateableTokenField 
 */
bbq.gui.updateables.UpdateableKeywords = new Class.create(bbq.gui.updateables.UpdateableTokenField, {
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._noItemsText = Language.get("bbq.gui.updateables.UpdateableKeywords.nokeywords");
		this.addClass("UpdateableKeywords");
	},
	
	_validateInput: function(input, currentValues) {
		return input != "" && currentValues.indexOf(input) == -1;
	}
});
