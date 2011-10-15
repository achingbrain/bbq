include(bbq.gui.updateables.UpdateableFieldWithInstruction);

/**
 * @class bbq.gui.updateables.UpdateableTextArea
 * @extends bbq.gui.updateables.UpdateableFieldWithInstruction
 */
bbq.gui.updateables.UpdateableTextArea = new Class.create(bbq.gui.updateables.UpdateableFieldWithInstruction, {
	
	/**
	 * @param {Object} options An options object
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("UpdateableTextArea");
	},
	
	/**
	 * Creates Edit field
	 */
	createEditField: function() {
		this.empty();
		
		this.inputField = DOMUtil.createTextElement("textarea", this._getCurrentValue(), {
			disabled: this.disabled, 
			onkeyup: this.updateLocalValue.bindAsEventListener(this),
			onfocus: this._clearFocusWatcher.bind(this)
		});
		
		if(this.options.inlineInstruction) {
			if(this.inputField.value == this.options.inlineInstruction || this.inputField.value == "") {
				this._showInstruction();
				Event.observe(this.inputField, "blur", this.blurInstructionField.bindAsEventListener(this));
				Event.observe(this.inputField, "focus", this.focusInstructionField.bindAsEventListener(this));
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
		// Internet explorer does not get on with having the event object hanging around
		// in the timeout closure below so copy the event object's properties
		var eventObject = {};
		
		for(var key in event) {
			if(!Object.isFunction(event[key])) {
				eventObject[key] = event[key];
			}
		}
		
		setTimeout(function() {
			if(this.options[type] && this.options[type] instanceof Function) {
				this.options[type]();
			}
			
			this.notifyListeners(type, eventObject);
		}.bind(this), 100);
	},
	
	/**
	 * Creates view field
	 */
	createViewField: function($super) {
		if(typeof(this.options.propertyDisplay) != "undefined") {
			return $super();
		}
		
		this.empty();
		
		if(this.displayValue && this.displayValue.split) {
			var theText = this.displayValue.split("\n");
			var tLength = theText.length;
			for(var i = 0; i < tLength; i++) {
				this.appendChild(document.createTextNode(theText[i]));
				
				if(tLength > 1 && i != (tLength - 1)) {
					this.appendChild(document.createElement("br"));
				}
			}
		} else {
			this.appendChild(document.createTextNode(" "));
		}
	}
});
