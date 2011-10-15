/**
 * @class bbq.gui.updateables.InputException
 */
bbq.gui.updateables.InputException = new Class.create({
	message: null,
	
	/**
	 * @param {String} message
	 */
	initialize: function(message) {
		this.message = message;
	}
});
