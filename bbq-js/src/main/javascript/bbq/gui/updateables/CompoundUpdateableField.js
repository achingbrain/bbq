include(bbq.gui.updateables.UpdateableField);
include(bbq.gui.button.DeleteButton);

/**
 * @class bbq.gui.updateables.CompoundUpdateableField
 * @extends bbq.gui.updateables.UpdateableField  
 */
bbq.gui.updateables.CompoundUpdateableField = new Class.create(bbq.gui.updateables.UpdateableField, {
	_deleted: null,
	_inputFields: null,
	inputFieldNames: null,
	_deleteButton: null,
	
	/**
	 * Constructor
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */ 
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("CompoundUpdateableField");
		this._createInputFields();
		this._inputFields.each(function(field) {
			// forward onValueChanged events so containing ExpandableFieldGroup will know we have been edited
			field.registerListener("onValueChanged", this.notifyListeners.bind(this, "onValueChanged"));
		}.bind(this));
		
		this._deleted = false;
		this.constructViewNode();
	},
	
	_createInputFields: function() {
		
	},
	
	createEditField: function() {
		if(this._deleted) {
			return;
		}
		
		this.empty();
		var form = DOMUtil.createNullForm();
		
		this._deleteButton = new bbq.gui.button.DeleteButton({onclick: this.deleteField.bind(this)});
		this._deleteButton.appendTo(form);
		
		for(var i = 0, iCount=this._inputFields.length; i < iCount; i++) {
			this._inputFields[i].setEditMode(true);
			this._inputFields[i].appendTo(form);
		}
		
		form.style.display = "none";
		
		this.appendChild(form);
		
		Effect.Appear(form, {duration: 0.25});
	},
	
	createViewField: function() {
		if(this._deleted) {
			return;
		}
		
		this.constructViewNode();
		this.empty();
		this.appendChild(this._getDisplayValue());
	},
	
	constructViewNode: function() {
		var fragment = document.createDocumentFragment();
		var inputLength = this._inputFields.length;
		for(var i = 0; i < inputLength; i++) {
			this._inputFields[i].setEditMode(false);
			var value = this._inputFields[i]._getDisplayValue();
			
			if(value) {
				if(i == 0) {
					var bold = document.createElement("strong");
					this._inputFields[i].appendTo(bold);
					fragment.appendChild(bold);
				} else {
					fragment.appendChild(document.createTextNode(value));
				}
				
				if(inputLength > 1 && i != (inputLength-1)) {
					fragment.appendChild(document.createElement("br"));
				}
			}
		}
		
		this._setDisplayValue(fragment);
	},
	
	deleteField: function() {
		this._deleted = true;
		this.empty();
		
		this.getRootNode().parentNode.parentNode.style.display = "none";
		return false;
	},
	
	cancelEdit: function() {
		this.currentValue = this.originalValue;
		
		var emptyFields = 0;
			
		for(var i = 0, iCount=this._inputFields.length; i < iCount; i++) {
			this._inputFields[i].setEditMode(false);
			this._inputFields[i].cancelEdit();
			
			if(i > 0 && i < 6) {
				if(!this._inputFields[i].getValue() || (this._inputFields[i].getValue().replace && this._inputFields[i].getValue().replace(/^\s*|\s*$/g,"") == "")) {
					emptyFields++;
				}
			}
		}
		
		if(emptyFields == 5) {
			this.deleteField();
			return;
		}
		
		this.constructViewNode();
	},
	
	setDisabled: function(disabled) {
		for(var i = 0, iCount=this._inputFields.length; i < iCount; i++) {
			this._inputFields[i].setDisabled(disabled);
		}
		
		this._deleteButton.setDisabled(disabled);
	},
	
	saveEdit: function() {
		for(var i = 0, iCount=this._inputFields.length; i < iCount; i++) {
			this._inputFields[i].saveEdit();
			this._inputFields[i].setEditMode(false);
		}
		
		this.originalValue = this.currentValue;
		this.constructViewNode();
	},
	
	getValue: function() {
		if(this._deleted) {
			return null;
		}
		
		var output = {};
		
		this._inputFieldNames.each(function(fieldName, index) {
			output[fieldName] = this._inputFields[index].getValue();
		}.bind(this));
		
		return output;
	},
	
	updateLocalValue: function() {
		this._inputFields.invoke("updateLocalValue");
	}
});
