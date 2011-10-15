include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.UpdateableDropDown
 * @extends bbq.gui.updateables.UpdateableField  
 */
bbq.gui.updateables.UpdateableDropDown = new Class.create(bbq.gui.updateables.UpdateableField, {
	dropDown: null,
	fields: null,
	
	/**
	 * 
	 * Supports the folloing options:
	 * 
	 * options: {
	 * 		keys: Array
	 * }
	 * 
	 * Supports the following callbacks
	 * 
	 * onValueChanged
	 * 
	 * @param {Object} options
	 * 
	 * }
	 */
	initialize: function($super, options) {
		$super(options);	
		
		this.addClass("UpdateableDropDown");
	},
	
	_setInitialValues: function() {
		this.fields = this.options.keys;
		this.options.initialValue = this.options.initialValue ? this.options.initialValue : 0;
		bbq.gui.updateables.UpdateableField.prototype._setInitialValues.call(this);
		this._setDisplayValue(this.fields[this._getCurrentValue()]);
	},
	
	_updateInitialValues: function() {
		bbq.gui.updateables.UpdateableField.prototype._updateInitialValues.call(this);
		this._setDisplayValue(this.fields[this._getCurrentValue()]);
	},
	
	_createViewFieldFromPropertyDisplay: function() {
		return this.options.propertyDisplay.entity.getPropertyDisplay({property: this.options.propertyDisplay.key, formatter: function(key) {
			return this.fields[key]
		}.bind(this)});
	},
	
	/**
	 * Cancels drop down change to the previous state
	 */
	cancelEdit: function() {
		this._setCurrentValue(this._getOriginalValue());
		this._setDisplayValue(this.fields[this._getCurrentValue()]);
	},
	
	/**
	 * Creates drop down fields
	 */
	createEditField: function() {
		this.dropDown = DOMUtil.createElement("select", {
			onfocus: this._clearFocusWatcher.bind(this),
			onchange: this.updateLocalValue.bindAsEventListener(this)
		});
		
		if(this.fields instanceof Array) {
			for(var i = 0, iCount=this.fields.length; i < iCount; i++) {
				var node = document.createElement("option");
				node.appendChild(document.createTextNode(this.fields[i]));
				node.value = i;
				
				if(i == this._getCurrentValue()) {
					node.selected = "selected";
				}
				
				this.dropDown.appendChild(node);
			}
		} else {
			for(var key in this.fields) {
				var node = document.createElement("option");
				node.appendChild(document.createTextNode(this.fields[key]));
				node.value = key;
				
				if(key == this._getCurrentValue()) {
					node.selected = "selected";
				}
				
				this.dropDown.appendChild(node);
			}
		}
		
		this.dropDown.disabled = this.disabled;
		return this.dropDown;
	},
	
	/**
	 * Saves drop down change
	 */
	saveEdit: function() {
		this._setOriginalValue(this._getCurrentValue());
		this._setDisplayValue(this.fields[this._getCurrentValue()]);
	},
	
	/**
	 * Updaates local value and triggers Event "onchange"
	 * @return {void}
	 */
	updateLocalValue: function() {
		if(this.dropDown && this.dropDown.selectedIndex != null) {
			this._setCurrentValue(this.dropDown.selectedIndex);
			this._setDisplayValue(this.fields[this._getCurrentValue()]);
		}
		
		this.notifyListeners("onValueChanged");
	},
	
	getValue: function(supressErrorWarning) {
		if(!this.getEditMode() && this.fields[this._getCurrentValue()] && this.fields[this._getCurrentValue()].strip() == "") {
			// if the visual representation of this field is an empty string, return null so we will be skipped in tables with hideEmptyFields set to true
			return null;
		}
		
		if(this.options.values && this.options.values[this._getCurrentValue()]) {
			return this.options.values[this._getCurrentValue()];
		}
	
		return this._getCurrentValue();
	}
});
