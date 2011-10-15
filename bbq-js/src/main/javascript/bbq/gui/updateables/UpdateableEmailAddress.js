include(bbq.gui.updateables.CompoundUpdateableField);
include(bbq.gui.updateables.UpdateableDropDown);
include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.updateables.UpdateableEmailAddress
 * @extends bbq.gui.updateables.CompoundUpdateableField
 */
bbq.gui.updateables.UpdateableEmailAddress = new Class.create(bbq.gui.updateables.CompoundUpdateableField, {
		
	/**
	 *  Constructor
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._inputFieldNames = ["category", "address"];
		this.addClass("UpdateableEmailAddress");
	},
	
	_createInputFields: function() {
		this._inputFields = [
			new bbq.gui.updateables.UpdateableDropDown({initialValue: this._getCurrentValue().category, keys: Language.getArray("bbq.gui.updateables.UpdateableEmailAddress.category")}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().address})
		];
	},
	
	/**
	 * @return {Object} returns email address value
	 */
	getValue: function() {
		if(this._deleted) {
			return null;
		}
		
		var value = bbq.gui.updateables.CompoundUpdateableField.prototype.getValue.call(this);
		
		if(value["emailAddress"] == "") {
			return null;
		}
		
		return value;
	}
});
