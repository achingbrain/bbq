include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.NonUpdateableRichTextField
 * @extends bbq.gui.updateables.UpdateableField
 */
bbq.gui.updateables.NonUpdateableRichTextField = new Class.create(bbq.gui.updateables.UpdateableField, {
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
