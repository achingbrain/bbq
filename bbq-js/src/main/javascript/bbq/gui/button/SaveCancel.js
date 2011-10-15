include(behaviour.gui.button.ButtonHolder);
include(behaviour.gui.button.NativeButton);
include(behaviour.gui.button.GUIButton);

/**
 * @class bbq.gui.button.SaveCancel
 * @extends bbq.gui.button.ButtonHolder
 * 
 */
bbq.gui.button.SaveCancel = Class.create(behaviour.gui.button.ButtonHolder, {
	_editMode: null,

	/**
	 * Constructor
	 * @param {Object} options
	 * @example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		changedCallback: Function		// should return true if the object has been edited
	 * 		editCallback: Function
	 * 		saveCallback: Function
	 * 		cancelCallback: Function,
	 * 		editText: String,
	 * 		saveText: String,
	 * 		cancelText: String,
	 * 		nativeButtons: true
	  * }
	 */
	initialize: function($super, options) {
		$super(options);

		this.addClass("SaveCancel");

		this.options.editText = this.options.editText ? this.options.editText : Language.get("bbq.gui.button.SaveCancel.edit");
		this.options.saveText = this.options.saveText ? this.options.saveText : Language.get("bbq.gui.button.SaveCancel.save");
		this.options.cancelText = this.options.cancelText ? this.options.cancelText : Language.get("bbq.gui.button.SaveCancel.cancel");

		this.setEditMode(false);
	},

	/**
	 * Sets edit mode
	 * @param {boolean} mode
	 */
	setEditMode: function(mode) {
		this._editMode = mode;

		if(mode) {
			this.addButton(new behaviour.gui.button[(this.options.nativeButtons ? "Native" : "GUI") + "Button"]({buttonText: this.options.saveText, onclick: this.saveEdit.bind(this), attributes: {className: "saveButton"}}));
			this.addButton(new behaviour.gui.button[(this.options.nativeButtons ? "Native" : "GUI") + "Button"]({buttonText: this.options.cancelText, onclick: this.cancelEdit.bind(this), attributes: {className: "cancelButton"}}));

			if(this.options.changedCallback) {
				EditWatcher.registerEditor(this, this.options.changedCallback, this.options.changeWarning ? this.options.changeWarning : false);
			}
		} else {
			this.addButton(new behaviour.gui.button[(this.options.nativeButtons ? "Native" : "GUI") + "Button"]({buttonText: this.options.editText, onclick: this.startEdit.bind(this), attributes: {className: "editButton"}}));

			if(this.options.changedCallback) {
				EditWatcher.deRegisterAllEditors();
			}
		}

		this.render();
	},

	/**
	 * @return {boolean} 
	 */
	getEditMode: function() {
		return this._editMode;
	},

	/**
	 * Starts edit process
	 */
	startEdit: function() {
		try {
			if(this.options.changedCallback && EditWatcher.changesOutstanding(this)) {
				return;
			}

			this.setEditMode(true);
			this._callCallback("editCallback");
			this.notifyListeners("startedEdit");
		} catch(e) {
			Log.error("Error starting edit", e);
		}
	},

	/**
	 * Saves edit fields
	 */
	saveEdit: function() {
		try {
			this.setEditMode(false);

			this._callCallback("saveCallback");
			this.notifyListeners("savedEdit");
			this.notifyListeners("stoppedEdit");
		} catch(e) {
			Log.error("Error saving edit", e);
		}
	},

	/**
	 * Cancels edit process
	 */
	cancelEdit: function() {
		try {
			this.setEditMode(false);
			this._callCallback("cancelCallback");
			this.notifyListeners("cancelledEdit");
			this.notifyListeners("stoppedEdit");
		} catch(e) {
			Log.error("Error canceling edit", e);
		}
	},

	/**
	 * @private
	 * @param {Function} callbackName
	 */
	_callCallback: function(callbackName) {
		if(this.options[callbackName] instanceof Function) {
			this.options[callbackName]();
		}
	}
});
