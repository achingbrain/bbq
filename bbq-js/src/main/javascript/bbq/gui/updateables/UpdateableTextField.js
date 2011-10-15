include(bbq.gui.updateables.UpdateableFieldWithInstruction);

/**
 * @class bbq.gui.updateables.UpdateableTextField A single line HTML text input field.
 * @extends bbq.gui.updateables.UpdateableFieldWithInstruction 
 */
bbq.gui.updateables.UpdateableTextField = new Class.create(bbq.gui.updateables.UpdateableFieldWithInstruction, {
	
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
		$super(options);
		
		this.addClass("UpdateableTextField");
	},
	
	/**
	 * Creates an editable representation of this field
	 */
	createEditField: function() {
		this.inputField = this._createEditField();
		
		if(this.options.inlineInstruction) {
			if(Browser.forms.placeholderText) {
				this.inputField.placeholder = this.options.inlineInstruction;
			} else {
				if (this.inputField.value == this.options.inlineInstruction || this.inputField.value == "") {
					this._showInstruction();
					Event.observe(this.inputField, "blur", this.blurInstructionField.bindAsEventListener(this));
					Event.observe(this.inputField, "focus", this.focusInstructionField.bindAsEventListener(this));
				}
			}
		}
		
		Event.observe(this.inputField, "blur", this._processEventCallback.bindAsEventListener(this, "onblur"));
		Event.observe(this.inputField, "focus", this._processEventCallback.bindAsEventListener(this, "onfocus"));
		Event.observe(this.inputField, "change", this._processEventCallback.bindAsEventListener(this, "onchange"));
		Event.observe(this.inputField, "keydown", this._processEventCallback.bindAsEventListener(this, "onkeydown"));
		Event.observe(this.inputField, "keyup", this._processEventCallback.bindAsEventListener(this, "onkeyup"));
		Event.observe(this.inputField, "keypress", this._processEventCallback.bindAsEventListener(this, "onkeypress"));
		Event.observe(this.inputField, "click", this._processEventCallback.bindAsEventListener(this, "onclick"));
		
		Event.observe(this.inputField, "blur", function() {
			this.inputField.hasFocus = false;
		}.bind(this));
		Event.observe(this.inputField, "focus", function() {
			this.inputField.hasFocus = true;
		}.bind(this));
		
		return this.inputField;
	},
	
	_processEventCallback: function(event, type) {
		setTimeout(function() {
			if(this.options[type] && this.options[type] instanceof Function) {
				this.options[type]();
			}
			
			this.notifyListeners(type, event);
		}.bind(this), 100);
	},
	
	/**
	 * Sets a timeout to call updateLocalValue - necessary as Internet Explorer is stupid
	 * 
	 */
	preUpdateLocalValue: function(event) {
		setTimeout(this.updateLocalValue.bind(this), 10);
	},
	
	/**
	 * @private
	 */
	_createEditField: function() {
		return DOMUtil.createElement("input", {
			type: (this.options.searchBox && Browser.forms.types.search ? "search" : "text"),
			value: this._getDisplayValue(),
			onchange: this.updateLocalValue.bindAsEventListener(this),
			onkeydown: this.preUpdateLocalValue.bindAsEventListener(this),
			onfocus: this._clearFocusWatcher.bind(this),
			disabled: this.disabled,
			autocomplete: "off",
			oncomplete: "off"
		});		
	}
});
