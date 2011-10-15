include(bbq.gui.updateables.CompoundUpdateableField);
include(bbq.gui.updateables.UpdateableDropDown);
include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.updateables.UpdateablePredicate
 * @extends bbq.gui.updateables.CompoundUpdateableField
 */
bbq.gui.updateables.UpdateablePredicate = new Class.create(bbq.gui.updateables.CompoundUpdateableField, {
	
	/**
	 *  Constructor
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 */
	initialize: function($super, options) {
		if(!options) {
			options = {};
		}
		
		if(options.data) {
			options.startValue = [options.data.category, options.data.type, options.data.number];
			//options.startValue = [options.data.type, options.data.subType, options.data.data];
		} else {
			options.startValue = [null, null, ""];
		}
		
		//options.inputFieldNames = new Array("type", "subType", "data");
		
		options.inputFieldNames = new Array("category", "type", "number");
		
		$super(options);
		
		this.addClass("predicateField");
		
		this.inputFields = [
			new bbq.gui.updateables.UpdateableDropDown({initialValue: this.currentValue[0], keys: Language.getArray("bbq.gui.updateables.UpdateablePredicate.category")}),
			new bbq.gui.updateables.UpdateableDropDown({initialValue: this.currentValue[1], keys: Language.getArray("bbq.gui.updateables.UpdateablePredicate.numbertype")}),
			new bbq.gui.updateables.UpdateableTextField({initialValue: this.currentValue[2]})
		];
		
		this.constructViewNode();
	},
	
	getValue: function($super) {
		if(this.deleted) {
			return null;
		}
		
		var value = $super();
		
		if(value["number"] == "") {
			return null;
		}
		
		return value;
	}
});
