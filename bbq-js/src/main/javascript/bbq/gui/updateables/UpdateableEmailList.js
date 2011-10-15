include(bbq.gui.updateables.UpdateableTokenField);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.updateables.UpdateableEmailList
 * @extends bbq.gui.updateables.UpdateableTokenField 
 */
bbq.gui.updateables.UpdateableEmailList = new Class.create(bbq.gui.updateables.UpdateableTokenField, {
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._noItemsText = Language.get("bbq.gui.updateables.UpdateableEmailList.norecipients");
		this.addClass("UpdateableEmailList");
	},
	
	_validateInput: function(input, currentValues) {
		return input != "" && currentValues.indexOf(input) == -1 && BBQUtil.isValidEmail(input);
	}
});
