include(bbq.gui.updateables.UpdateableFieldGroup);
include(bbq.gui.button.AddButton);

/**
 * @class bbq.gui.updateables.ExpandableFieldGroup
 * @extends bbq.gui.updateables.UpdateableFieldGroup
 */
bbq.gui.updateables.ExpandableFieldGroup = new Class.create(bbq.gui.updateables.UpdateableFieldGroup, {
	_tableBody: null,
	_newItemButton: null,
	_updateFunction: null,
	_callbackKey: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("table");
		this.addClass("ExpandableFieldGroup");
		this._newItemButton = new bbq.gui.button.AddButton({onclick: this.addItem.bindAsEventListener(this), attributes: {style: {"display": "none"}}});
		this.appendChild(DOMUtil.createTextElement("thead", DOMUtil.createTextElement("tr", DOMUtil.createTextElement("th", this._newItemButton))));
		this._tableBody  = this.appendChild(DOMUtil.createElement("tbody"));
		
		if(this.options.entities) {
			// use pre-existing entities
			this.options.entities.each(function(entity) {
				this.addPreExistingItem(entity);
			}.bind(this));
		} else if(this.options.propertyDisplay) {
			// use properties on passed entity
			this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key).each(function(entity) {
				this.addPreExistingItem(entity);
			}.bind(this));
			
			// ensure that we will display current data when an object has been updated
			this._callbackKey = this.options.propertyDisplay.entity.registerListener("onDataLoaded", this._updateDisplay.bind(this));
		}
	},
	
	_updateDisplay: function(options) {
		if(!this.getEditMode()) {
			this._fields = [];
			this._fieldOptions = [];
			
			this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key).each(function(entity) {
				this.addPreExistingItem(entity);
			}.bind(this));
			
			this.render();
		}
	},
	
	deregisterChildListeners: function() {
		if(this.options.propertyDisplay) {
			Log.info("removing listener");
			this.options.propertyDisplay.entity.deRegisterListener("onDataLoaded", this._callbackKey);
		}
	},
	
	render: function() {
		DOMUtil.emptyNode(this._tableBody);
		
		this._fields.each(function(field) {
			if(field._deleted) {
				return;
			}
			
			this._tableBody.appendChild(DOMUtil.createTextElement("tr", DOMUtil.createTextElement("td", field)));
			field.setEditMode(this._editMode);
		}.bind(this));
	},
	
	/**
	 * @param {integer} editMode
	 */
	setEditMode: function($super, editMode) {
		$super(editMode);
		
		this._editMode = editMode;
		this._newItemButton.setStyle("display", (editMode ? "block" : "none"));
	},
	
	addItem: function() {
		try {
			var newItem = this.options.newItemMethod();
			this.addField(newItem, {name: this.options.title + "-" + this._fields.length});
			
			var row = document.createElement("tr");
			var cell = document.createElement("td");
			newItem.appendTo(cell);
			row.appendChild(cell);
			this._tableBody.appendChild(row);
			
			newItem.setEditMode(this._editMode);
		} catch(e) {
			Log.error("Error adding item", e);
		}
		
		return false;
	},
	
	/**
	 * @param {Object} item
	 */
	addPreExistingItem: function(item) {
		var newItem = this.options.newItemMethod.call(this, {initialValue: item});
		this.addField(newItem, {name: this.options.title + "-" + this._fields.length});
	},
	
	clearError: function() {
		this._fields.each(function(field) {
			field.clearError();
		})
	},
	
	getValue: function() {
		return this._fields.collect(function(field) {
			return field && field.deleted && field.getValue instanceof Function ? null : field.getValue();
		}).compact();
	},
	
	/**
	 * @param {boolean} disabled
	 */
	setDisabled: function($super, disabled) {
		$super(disabled);
		
		this._newItemButton.setDisabled(disabled);
	},
	
	cancelEdit: function($super) {
		// remove empty fields
		for(var i = 0; i < this._fields.length; i++) {
			if(this._fields[i].getValue() == null) {
				this._fields.splice(i, 1);
				i--;
			}
		}
		
		$super();
		
		this.render();
	},
	
	changed: function() {
		var changed = bbq.gui.updateables.UpdateableFieldGroup.prototype.changed.call(this);
		
		this._fields.each(function(field) {
			if(field._deleted) {
				changed = true;
			}
		});
		
		return  changed;
	}
});
