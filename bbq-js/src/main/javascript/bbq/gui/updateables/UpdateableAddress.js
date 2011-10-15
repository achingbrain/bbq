include(bbq.gui.updateables.CompoundUpdateableField);
include(bbq.gui.updateables.UpdateableDropDown);
include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.updateables.UpdateableAddress
 * @extends bbq.gui.updateables.CompoundUpdateableField 
 */
bbq.gui.updateables.UpdateableAddress = new Class.create(bbq.gui.updateables.CompoundUpdateableField, {
	/**
	 * Constructor
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		this._inputFieldNames = ["category", "house", "street", "area", "region", "postcode", "country"];
		this.addClass("UpdateableAddress");
		
		$super(options);
	},
	
	_createInputFields: function() {
		this._inputFields = [
			new bbq.gui.updateables.UpdateableDropDown({initialValue: this._getCurrentValue().addressCategory, keys: Language.getArray("bbq.gui.updateables.UpdateableAddress.category")}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().house, inlineInstruction: Language.get("bbq.gui.updateables.UpdateableAddress.addresstype" + deadline.constants.DEADLINE_ADDRESS_HOUSE)}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().street, inlineInstruction: Language.get("bbq.gui.updateables.UpdateableAddress.addresstype" + deadline.constants.DEADLINE_ADDRESS_STREET)}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().area, inlineInstruction: Language.get("bbq.gui.updateables.UpdateableAddress.addresstype" + deadline.constants.DEADLINE_ADDRESS_TOWN)}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().region, inlineInstruction: Language.get("bbq.gui.updateables.UpdateableAddress.addresstype" + deadline.constants.DEADLINE_ADDRESS_CITY)}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().postcode, inlineInstruction: Language.get("bbq.gui.updateables.UpdateableAddress.addresstype" + deadline.constants.DEADLINE_ADDRESS_POSTCODE)}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this._getCurrentValue().country, inlineInstruction: Language.get("bbq.gui.updateables.UpdateableAddress.addresstype" + deadline.constants.DEADLINE_ADDRESS_COUNTRY)})
		];
	},
	
	/**
	 * @return {Object} returns address fields value
	 */
	getValue: function() {
		if(this._deleted) {
			return null;
		}
		
		var value = bbq.gui.updateables.CompoundUpdateableField.prototype.getValue.call(this);
		
		if(value["house"] == "" && value["street"] == "" && value["area"] == "" && value["region"] == "" && value["postcode"] == "") {
			return null;
		}
		
		return value;
	}
});
