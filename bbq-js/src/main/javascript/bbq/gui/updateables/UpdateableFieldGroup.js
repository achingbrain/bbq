include(bbq.gui.GUIWidget);

/**
 * @class bbq.gui.updateables.UpdateableFieldGroup
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.updateables.UpdateableFieldGroup = new Class.create(bbq.gui.GUIWidget, {
	_fields: null,
	_fieldOptions: null,
	_editMode: null,
	_preSubmitFilters: null,
	
	/**
	 * Constructor
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		namespace: String		//  If passed all field values will be prefixed by namespace:  - eg. pass "person" for "person:name", etc.  Allow us to sanely submit two entities data in one go
	 * }
	 * 
	 * @param {Object} options
	  */
	initialize: function($super, options) {
		$super(options);
		
		this._fields = [];
		this._fieldOptions = [];
		this._preSubmitFilters = [];
	},
	
	/**
	 * 	Supports the following options:
	 * 
	 * options: {
	 * 		name: String				// The name of the variable this field represents
	 * 		label: String				// The text to be displayed next to the field
	 * 		ignoreValue: boolean	//  If true the field will not be queried for a value when getValues is called
	 * 		nonEditable: boolean	//  If true the field will not be put into edit mode
	 * 	}
	 * 
	 * @param {bbq.gui.updateables.UpdateableField} field
	 * @param {Object} options
	 */
	addField: function(field, options) {
		this._fields.push(field);
		this._fieldOptions.push(options ? options : {});
		
		return field;
	},
	
	removeField: function(fieldName) {
		for(var i = 0; i < this._fieldOptions.length; i++) {
			if(this._fieldOptions[i].name == fieldName) {
				var needRender = false;
				
				// only need update if we are removing a visible field
				if(!(this._fields[i] instanceof bbq.gui.updateables.UpdateableInvisibleField)) {
					needRender = true;
				}
				
				// remove the field and it's options
				this._fields.splice(i, 1);
				this._fieldOptions.splice(i, 1);
				
				// update if needed
				if(needRender && this.getRootNode() && this.getRootNode().parentNode) {
					this.render();
				}
			}
		}
	},
	
	addPreSubmitFilter: function(filter) {
		this._preSubmitFilters.push(filter);
	},
	
	/**
	 * @param {boolean} editMode
	 */
	setEditMode: function(editMode) {
		this._editMode = editMode;
		
		this.render();
		
		for(var i = 0, iCount = this._fields.length; i < iCount; i++) {
			if(this._fields[i] && !this._fieldOptions[i].nonEditable) {
				this._fields[i].setEditMode(editMode);
			}
		}
		
		if(editMode) {
			this.addClass("UpdateableFieldGroup_EditMode");
		} else {
			this.removeClass("UpdateableFieldGroup_EditMode");
		}
	},
	
	/**
	 * @return {boolean}
	 */
	getEditMode: function() {
		return this._editMode;
	},
	
	/**
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		for(var i = 0, iCount = this._fields.length; i < iCount; i++) {
			if(this._fields[i] && !this._fieldOptions[i].nonEditable) {
				this._fields[i].setDisabled(disabled);
			}
		}
	},
	
	/**
	 * saves edited fields
	 */
	saveEdit: function() {
		for(var i = 0, iCount = this._fields.length; i < iCount; i++) {
			if(this._fields[i] && !this._fieldOptions[i].nonEditable) {
				this._fields[i].saveEdit();
			}
		}
	},
	
	/**
	 * cancel edit process and revert to previous state
	 */
	cancelEdit: function() {
		for(var i = 0, iCount = this._fields.length; i < iCount; i++) {
			if(this._fields[i] && !this._fieldOptions[i].nonEditable) {
				this._fields[i].cancelEdit();
			}
		}
	},
	
	/**
	 * @return {Object} output
	 */
	getValues: function() {
		var output = {};
		
		for(var i = 0; i < this._fields.length; i++) {
			if(this._fields[i] && !this._fieldOptions[i].ignoreValue) {
				this._fields[i].clearError();
				
				output[(this.options.namespace ? this.options.namespace + ":" : "") + this._fieldOptions[i]["name"]] = this._fields[i].getValue();
			}
		}
		
		this._preSubmitFilters.each(function(filter) {
			var errorField = filter(output);
			
			if(errorField) {
				for(var i = 0; i < this._fields.length; i++) {
					if((this.options.namespace ? this.options.namespace + ":" : "") + this._fieldOptions[i]["name"] == errorField) {
						this._fields[i].triggerError();
					}
				}
			}
		}.bind(this));
		
		return output;
	},
	
	/**
	 * @return {string} output
	 */
	getValuesAsString: function() {
		var output = "";
		var values = this.getValues();
		
		for(var key in values) {
			output += this.parseValues(key, values[key]);
		}
		
		return output;
	},
	
	/**
	 * @param {string} key
	 * @param {mixed} value
	 * @return {string} output
	 */
	parseValues: function(key, value) {
		if(value instanceof Array) {
			for(var i = 0, iCount=value.length; i < iCount; i++) {
				output += this.parseValues(key + "[]", value[i]) + "&";
			}
		} else if(key) {
			output = key + "=" + encodeURIComponent(value) + "&";
		}
		
		return output;
	},
	
	/**
	 * @param {string} key
	 * @return Returns fields values
	 * @type {mixed}
	 */
	getValue: function(key) {
		for(var i = 0, iCount=this._fieldOptions.length; i < iCount; i++) {
			if(this._fieldOptions[i].name == key && !this._fieldOptions[i].ignoreValue) {
				return this._fields[i].getValue();
			}
		}
	},
	
	/**
	 * @return fields
	 * @type {mixed}
	 */
	getFields: function() {
		return this._fields
	},
	
	changed: function() {
		var changed = false;
		
		this._fields.each(function(field, index) {
			
			if(this._fieldOptions[index] && this._fieldOptions[index].ignoreValue) {
				return;
			}
			
			if(field && field.changed) {
				if(field.changed()) {
					changed = true;
				}
			}
		}.bind(this));
		
		return changed;
	},
	
	/**
	 * b0rk b0rk b0rk.  Because of no support for DOMNodeRemoved events in IEx, we must manually tell our child updateables to clean up after themselves.
	 */
	deregisterChildListeners: function() {
		this._fields.each(function(field) {
			if(field && field.deregisterChildListeners) {
				field.deregisterChildListeners();
			}
		}.bind(this));
	}
});
