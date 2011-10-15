include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.NonUpdateableImageField
 * @extends bbq.gui.updateables.UpdateableField
 */
bbq.gui.updateables.NonUpdateableImageField = new Class.create(bbq.gui.updateables.UpdateableField, {
	createEditField: function() {
		
	},
	
	setEditMode: function() {
		
	},
	
	/**
	 * @return {string} 
	 */
	getValue: function() {
		return "";
	}
});
