include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.UpdateableInvisibleField
 * @extends bbq.gui.updateables.UpdateableField
 */
bbq.gui.updateables.UpdateableInvisibleField = new Class.create(bbq.gui.updateables.UpdateableField, {
	createEditField: function() {
		this.setRootNode(document.createDocumentFragment());
	},
	
	addClass: function() {
		
	},
	
	removeClass: function() {
		
	}
});
