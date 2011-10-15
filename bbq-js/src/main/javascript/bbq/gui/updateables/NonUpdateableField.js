include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.NonUpdateableField
 * @extends bbq.gui.updateables.UpdateableField  
 */
bbq.gui.updateables.NonUpdateableField = new Class.create(bbq.gui.updateables.UpdateableField, {
	createEditField: function() {
		
	},
	
	setEditMode: function() {
		
	},
	
	/**
	 * @return	{string}
	 */
	getValue: function() {
		return "";
	}
});
