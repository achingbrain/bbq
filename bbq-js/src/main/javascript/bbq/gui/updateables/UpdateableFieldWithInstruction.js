include(bbq.gui.updateables.UpdateableField);

/**
 * @class bbq.gui.updateables.UpdateableFieldWithInstruction
 * @extends bbq.gui.updateables.UpdateableField 
 */
bbq.gui.updateables.UpdateableFieldWithInstruction = new Class.create(bbq.gui.updateables.UpdateableField, {
	inputField: null,
	
	_showInstruction: function() {
		this.addClass("UpdateableFieldWithInstruction_DisplayingInstruction");
		this.addClass("UpdateableFieldWithInstruction_Blur");

		if(Browser.forms.placeholderText) {
			return;
		}

		this.inputField.value = this.options.inlineInstruction;
	},
	
	focusInstructionField: function(event) {
		this.removeClass("UpdateableFieldWithInstruction_Blur");
		this.addClass("UpdateableFieldWithInstruction_Focus");

		if(this.inputField.value == this.options.inlineInstruction) {
			this.removeClass("UpdateableFieldWithInstruction_DisplayingInstruction");

			if(Browser.forms.placeholderText) {
				return;
			}

			this.inputField.value = "";
		}
	},
	
	blurInstructionField: function(event) {
		this.removeClass("UpdateableFieldWithInstruction_Focus");

		if(Browser.forms.placeholderText) {
			return;
		}

		if(this.inputField.value == "") {
			this._showInstruction();
		} else if(this.inputField.value != this.options.inlineInstruction) {
			this.removeClass("UpdateableFieldWithInstruction_DisplayingInstruction");
		}
	},
	
	/**
	 * Updates the local store of the field value and makes a fuss if we are required but don't have a value.
	 */
	updateLocalValue: function() {
		if(this.options.inlineInstruction && this.inputField.value == this.options.inlineInstruction) {
			if(!Browser.forms.placeholderText) {
				this._setCurrentValue("");
			}
		} else {
			this._setCurrentValue(this.inputField.value.strip());
		}
		
		this.notifyListeners("onValueChanged");
		this.checkForRequired();
	}
});
