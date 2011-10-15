include(bbq.gui.updateables.UpdateableFieldGroup);
include(bbq.ajax.JSONRequest);

/**
 * @class bbq.gui.updateables.UpdateableFormView
 * @extends bbq.gui.updateables.UpdateableFieldGroup 
 */
bbq.gui.updateables.UpdateableFormView = new Class.create(bbq.gui.updateables.UpdateableFieldGroup, {
	
	_icon: null,
	_submitButton: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("form");
		this.addClass("UpdateableFormView");
	},
	
	/**
	 * Pass in a bbq.gui.button.GUIButton
	 */
	setSubmitButton: function(button) {
		this._submitButton = button;
	},
	
	/**
	 * Adds a row to the table.
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		invisible: boolean			//  If true the field will not be visible
	 * 		expanding: boolean		//  If true the field is treated as a field that is cabable of adding multiple instances of itself to the table
	 * 		icon: boolean				//  If true the field will be added to the right of the table and have extra blank rows added to pad the table to an appropriate height
	 * }
	 * 
	 * See bbq.gui.updateables.UpdatableFieldGroup#addField for more options
	 * 
	 * @param {bbq.gui.updateables.UpdateableField} fieldData The field
	 * @param {Object} options The field options.  See above for more details.
	 */
	addField: function($super, field, options) {
		$super(field, options);
		
		if(options && options.icon) {
			this.setIcon(field);
		}
		
		return field;
	},
	
	/**
	 * @param {bbq.gui.updateables.UpdatableField} field The icon field
	 */
	setIcon: function(field) {
		this._icon = field;
	},
	
	/**
	 * @param {Object} callback
	 */
	sendValues: function(callback) {
		var args = this.getValuesAsString();
		
		var saveRequest = new bbq.ajax.JSONRequest({url: this.options.saveURL, oncomplete: callback});
		saveRequest.sendRequest('post', args);
	},
	
	render: function() {
		this.empty();
		
		if(this._icon) {
			this._icon.setStyle("cssFloat", "right");
			this._icon.appendTo(this.getRootNode());
		}
		
		for(var i = 0, iCount=this._fields.length; i < iCount; i++) {
			if(this._fieldOptions[i].invisible || this._fields[i] == this._icon) {
				continue;
			}
			
			this.appendChild(DOMUtil.createTextElement("label", this._fieldOptions[i].label));
			
			if(this._fields[i]) {
				this._fields[i].appendTo(this.getRootNode());
			}
		}
	},
	
	setEditMode: function($super, editMode) {
		$super(editMode);
		
		this._registerKeypressListeners();
	},
	
	_shouldSubmit: function(event) {
		if(event.keyCode == 13) {
			Event.stop(event);
			this._submitButton.buttonClicked();
		}
	},
	
	setDisabled: function($super, disabled) {
		$super(disabled);
		
		if(this._submitButton) {
			this._submitButton.setDisabled(disabled);
			this._registerKeypressListeners();
		}
	},
	
	_registerKeypressListeners: function() {
		// if we have been given a submit button, watch each text field for an enter key as a signal to submit the form
		if(this._submitButton) {
			this._fields.each(function(field) {
				if(field instanceof bbq.gui.updateables.UpdateableTextField ||
					field instanceof bbq.gui.updateables.UpdateablePasswordField ||
					field instanceof bbq.gui.updateables.UpdateableEmailField) {
					Event.observe(field.inputField, "keypress", this._shouldSubmit.bindAsEventListener(this, "onkeypress"));
				}
			}.bind(this));
		}
	}
});
