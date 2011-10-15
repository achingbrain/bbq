include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.UpdateableCheckBox A single line HTML text input field.
 * @extends bbq.gui.updateables.UpdateableField 
 */
bbq.gui.updateables.UpdateableCheckBox = new Class.create(bbq.gui.updateables.UpdateableField, {
	inputField: null,
	
	/**
	 * @param {Object} options 
	 * @example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		searchBox: boolean				// if true will render a mac like search box on Safari
	 * }
	 */
	initialize: function($super, options) {
		if(typeof(options) == "undefined") {
			options = {};
		}
		
		options.initialValue = options.initialValue ? true : false; 
		
		$super(options);
		
		this.addClass("UpdateableCheckBox");
	},
	
	/**
	 * Creates an editable representation of this field
	 */
	createEditField: function() {
		this.inputField = DOMUtil.createElement("input", {type: "checkbox", checked: this.getValue(true)});
		
		Event.observe(this.inputField, "blur", this._processEventCallback.bindAsEventListener(this, "onblur"));
		Event.observe(this.inputField, "focus", this._processEventCallback.bindAsEventListener(this, "onfocus"));
		Event.observe(this.inputField, "change", this._processEventCallback.bindAsEventListener(this, "onchange"));
		Event.observe(this.inputField, "click", this._processEventCallback.bindAsEventListener(this, "onclick"));
		
		return this.inputField;
	},
	
	createViewField: function() {
		if(this.getValue(true) && this.options.checkedText) {
			return document.createTextNode(this.options.checkedText);
		} else if(!this.getValue(true) && this.options.unCheckedText) {
			return document.createTextNode(this.options.unCheckedText);
		}
		
		return bbq.gui.updateables.UpdateableField.prototype.createViewField.apply(this);
	},
	
	_processEventCallback: function(event, type) {
		setTimeout(function() {
			this.updateLocalValue();
			
			if(this.options[type] && this.options[type] instanceof Function) {
				this.options[type]();
			}
			
			this.notifyListeners(type);
		}.bind(this), 100);
	},
	
	updateLocalValue: function() {
		var newValue = this.inputField.checked ? true : false;
		var shouldNotify = false;
		
		if(this.currentValue != newValue) {
			shouldNotify = true;
		}
		
		this.currentValue = newValue;
		
		if(shouldNotify) {
			this.notifyListeners("onValueChanged");
		}
	},
	
	/**
	 * Ensure we return a boolean value
	 */
	getValue: function(supressErrorWarning) {
		if(bbq.gui.updateables.UpdateableField.prototype.getValue.call(this, supressErrorWarning)) {
			return true;
		}
		
		return false;
	}
});
