include(bbq.gui.GUIWidget);
include(bbq.gui.updateables.InputException);
include(bbq.web.FocusWatcher);

/**
 * @class bbq.gui.updateables.UpdateableField
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.updateables.UpdateableField = new Class.create(bbq.gui.GUIWidget, {
	
	editMode: null,
	disabled: null,
	displayValue: null,
	currentValue: null,
	originalValue: null,
	shortenDisplayField: null,
	_changed: null,
	_entityDataLoadedCallbackKey: null,
	_entityDataUpdatedCallbackKey: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		initialValue:	mixed							// Some sort of value
	 * 		propertyDisplay: Object					// {key: String, entity: Object}  If passed, ignores initialValue and will use #getPropertyDisplay(key, formatter) on the passed object for display value instead 
	 * 		required:	boolean
	 * 		errorText: String								// thrown as an exception if the field has no value
	 * 		shortenDisplayField: boolean
	  * }
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("span");
		
		this.shortenDisplayField = this.options.shortenDisplayField;
		this.editMode = false;
		
		this._setInitialValues();
		
		this.disabled = false;
		this._changed = false
		this.addClass("UpdateableField");
		
		if(!Object.isUndefined(this.options.propertyDisplay)) {
			// set up property display watchers
			this.setPropertyDisplay(this.options.propertyDisplay.key, this.options.propertyDisplay.entity);
		}
		
		// flag this field as updated when value is changed
		this.registerListener("onValueChanged", function() {
			this._changed = true;
		}.bind(this));
	},
	
	setPropertyDisplay: function(key, entity) {
		if(Object.isUndefined(this.options.propertyDisplay)) {
			this.options.propertyDisplay = {};
		} else {
			if(this._entityDataLoadedCallbackKey) {
				// if we were already watching an object for updates, stop watching it
				this.options.propertyDisplay.entity.deRegisterListener("onDataLoaded", this._entityDataLoadedCallbackKey);
			}
			
			if(this._entityDataUpdatedCallbackKey) {
				// if we were already watching an object for updates, stop watching it
				this.options.propertyDisplay.entity.deRegisterListener("onUpdate", this._entityDataUpdatedCallbackKey);
			}
		}
		
		this.options.propertyDisplay.key = key;
		this.options.propertyDisplay.entity = entity;
		
		// register for repeat notifications to update display when entity is remotely updated
		this._entityDataLoadedCallbackKey = this.options.propertyDisplay.entity.registerListener("onDataLoaded", function() {
			this._updateInitialValues();
			this.render();
		}.bind(this));
		
		// register for repeat notifications to update display when entity is remotely updated
		this._entityDataUpdatedCallbackKey = this.options.propertyDisplay.entity.registerListener("onUpdate", function() {
			this._updateInitialValues();
			this.render();
		}.bind(this));
		
		if(entity.dataLoaded()) {
			this._updateInitialValues();
			this.render();
		}
	},
	
	_setInitialValues: function() {
		if(!Object.isUndefined(this.options.propertyDisplay)) {
			
		} else {
			if(Object.isUndefined(this.options.initialValue) || this.options.initialValue == null) {
				this.options.initialValue = "";
			}
			
			this._setCurrentValue(this.options.initialValue);
			this._setOriginalValue(this.options.initialValue);
			this._setDisplayValue(this.options.initialValue);
		}
	},
	
	_updateInitialValues: function() {
		this._setCurrentValue(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key));
		this._setOriginalValue(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key));
		this._setDisplayValue(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key));
	},
	
	/*
	 * resets the internal field value to that prior editing
	 */
	cancelEdit: function() {
		this._setCurrentValue(this.originalValue);
		this._setDisplayValue(this.originalValue);
	},
	
	createEditField: function() {
		Log.info("Non overridden createEditField() method called");
	},
	
	/*
	 * creates view field
	 */
	createViewField: function() {
		if(typeof(this.options.propertyDisplay) != "undefined") {
			return this._createViewFieldFromPropertyDisplay();
		}
		
		if(this._getDisplayValue() && this._getDisplayValue().length > 0) {
			return document.createTextNode(this._getTruncatedValue());
		}
		
		return document.createTextNode(" ");
	},
	
	_getCurrentValue: function() {
		if(typeof(this.options.propertyDisplay) != "undefined" && typeof(this.currentValue) == "undefined") {
			this.currentValue = this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key);
		}
		
		return this.currentValue;
	},
	
	_setCurrentValue: function(value) {
		this.currentValue = value;
	},
	
	_getOriginalValue: function() {
		if(typeof(this.options.propertyDisplay) != "undefined") {
			return this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key);
		}
		
		return this.originalValue;
	},
	
	_setOriginalValue: function(value) {
		this.originalValue = value;
	},
	
	_getDisplayValue: function() {
		if(typeof(this.options.propertyDisplay) != "undefined" && !this.displayValue) {
			this.displayValue = this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key);
		}
		
		return this.displayValue;
	},
	
	_setDisplayValue: function(value) {
		this.displayValue = value;
	},
	
	_createViewFieldFromPropertyDisplay: function() {
		return this.options.propertyDisplay.entity.getPropertyDisplay({property: this.options.propertyDisplay.key, formatter: this.options.propertyDisplay.formatter});
	},
	
	_getTruncatedValue: function() {
		if(this.shortenDisplayField && this._getDisplayValue().length && this._getDisplayValue().length > 20) {
			return  this._getDisplayValue().substr(0, 9) + "..." + this._getDisplayValue().substr((this._getDisplayValue().length - 8), 8);
		}
		
		return this._getDisplayValue();
	},
	
	/**
	 * @param {Object} value
	 */
	setValue: function(value) {
		this._setCurrentValue(value);
		this._setDisplayValue(value);
		this.render();
	},
	
	/**
	 * @param {boolean} supressErrorWarning
	 * @return Returns the current field value 
	 * @type {Object}
	 */
	getValue: function(supressErrorWarning) {
		if(!supressErrorWarning && !this.checkForRequired()) {
			this.triggerError();
		}
		
		return this._getCurrentValue();
	},
	
	triggerError: function() {
		this.setError(true);
		this.notifyListeners("onError");
		throw new bbq.gui.updateables.InputException(this.options.errorText ? this.options.errorText : "field needs value");
	},
	
	/**
	 * draws the field either as a form for editing or text for display
	 */
	render: function() {
		this.empty();
		
		if(this.editMode) { // create edit node
			this.appendChild(this.createEditField());
			
			if(this.options.notes) {
				this.appendChild(DOMUtil.createTextElement("span", this.options.notes, {className: "UpdateableField_Notes"}));
			}
		} else { // create view node
			var view = this.createViewField();
			
			if(Object.isString(view)) {
				this.appendChild(document.createTextNode(view));
			} else {
				this.appendChild(view);
			}
		}
		
		if(this._getCurrentValue() != this._getOriginalValue()) {
			this.checkForRequired();
		}
	},
	
	/**
	 * saves the current field value internally
	 * 
	 */
	saveEdit: function() {
		this._setDisplayValue(this._getCurrentValue());
		this._setOriginalValue(this._getCurrentValue());
	},
	
	/**
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		if(this.disabled != disabled) {
			this.disabled = disabled;
			this.render();
		}
	},
	
	/**
	 * @param {integer} editMode
	 */
	setEditMode: function(editMode) {
		this.editMode = editMode;
		this.render();
	},
	
	getEditMode: function() {
		return this.editMode;
	},
	
	/**
	 * updates current value from input field
	 */
	updateLocalValue: function() {
		this._setCurrentValue(this.inputField.value);
		this.checkForRequired();
		this.notifyListeners("onValueChanged");
	},
	
	/**
	 * check if updateable field is required.  Returns false if we are required and do not have a value, true otherwise
	 */
	checkForRequired: function() {
		if(this.getEditMode()) {
			if(this.options.required && (!this._getCurrentValue() || (this._getCurrentValue().strip && this._getCurrentValue().strip() == ""))) {
				return false;
			}
		}
		
		return true;
	},
	
	/**
	 * @private
	 */
	_clearFocusWatcher: function() {
		FocusWatcher.setKeypressCallbackObject(this);
	},
	
	/**
	 * clears an error by removing the "error" class from the DOM
	 */
	clearError: function() {
		this.removeClass("error");
	},
	
	setError: function(error) {
		this.removeClass("error");
		
		if(error) {
			this.addClass("error");
		}
	},
	
	focus: function() {
		this.inputField.focus();
	},
	
	blur: function() {
		this.inputField.blur();
	},
	
	changed: function() {
		return this._changed;
	}
});
