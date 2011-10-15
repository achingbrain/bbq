include(bbq.gui.updateables.CompoundUpdateableField);
include(bbq.gui.updateables.UpdateableDropDown);
include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.updateables.UpdateableContactNumber
 * @extends bbq.gui.updateables.CompoundUpdateableField 
 */
bbq.gui.updateables.UpdateableContactNumber = new Class.create(bbq.gui.updateables.CompoundUpdateableField, {
	/**
	 * Constructor
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 */ 
	initialize: function($super, options) {
		this._inputFieldNames = ["category", "type", "number"];
		this.addClass("UpdateableContactNumber");
		
		$super(options);
	},
	
	_createInputFields: function() {
		this._inputFields = [
			new bbq.gui.updateables.UpdateableDropDown({initialValue: this._getCurrentValue().category, keys: Language.getArray("bbq.gui.updateables.UpdateableContactNumber.category")}),
			new bbq.gui.updateables.UpdateableDropDown({initialValue: this._getCurrentValue().type, keys: Language.getArray("bbq.gui.updateables.UpdateableContactNumber.numbertype")}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().number})
		];
	},
	
	/**
	 * @return {Object} returns contact number fields value
	 */
	getValue: function() {
		if(this._deleted) {
			return null;
		}
		
		var value = bbq.gui.updateables.CompoundUpdateableField.prototype.getValue.call(this);
		
		if(value["number"] == "") {
			return null;
		}
		
		return value;
	}
});
