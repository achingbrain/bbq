include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.updateables.UpdateablePasswordField
 * @extends bbq.gui.updateables.UpdateableTextField
 */
bbq.gui.updateables.UpdateablePasswordField = new Class.create(bbq.gui.updateables.UpdateableTextField, {
	
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("UpdateablePasswordField");
	},
	
	/**
	 * @private
	 */
	_createEditField: function() {
		this.inputField = bbq.gui.updateables.UpdateableTextField.prototype._createEditField.call(this);
		this.inputField.type = "password";
		this.inputField.value = "";
		
		Event.observe(this.inputField, "keypress", this._capslockWatcher.bindAsEventListener(this));
		
		return this.inputField;
	},
	
	createViewField: function() {
		if(this._getDisplayValue() && this._getDisplayValue().length > 0) {
			return document.createTextNode("**********");
		}
		
		return document.createTextNode(" ");
	},
	
	/**
	 * @param {boolean} supressErrorWarning
	 * @return Returns the current field value 
	 * @type {Object}
	 */
	getValue: function(supressErrorWarning) {
		if(this.inputField && this.inputField.value == "" && this._getOriginalValue()) {
			return -1;
		}
		
		return bbq.gui.updateables.UpdateableTextField.prototype.getValue.apply(this, arguments);
	},
	
	/**
	 * @private
	 */
	_checkForCapsLock: function(shiftKey) {
		try {
			if(Browser.InternetExplorer) {
				if(this._passwordFocused) {
					var lastChar = this.inputField.value.charAt(this.inputField.value.length - 1);
					
					if(lastChar && ((lastChar.toLowerCase() == lastChar && shiftKey) || (lastChar.toUpperCase() == lastChar && !shiftKey))) {
						DOMUtil.addClass(this.inputField, "UpdateablePasswordFieldCapsLockWarning");
						this._capsLockOn = true;
					} else {
						DOMUtil.removeClass(this.inputField, "UpdateablePasswordFieldCapsLockWarning");
						this._capsLockOn = false;
					}
				}
			}
		} catch(e) {
			Log.error("Error checking for caps lock", e);
		}
	},
	
	_capslockWatcher: function(event) {
		if(Browser.InternetExplorer) {
			// IE for once is actually useful in reporting caps lock key presses
			
			if(event.keyCode == 20) { // caps lock
				if(this._capsLockOn) {
					this._capsLockOn = false;
					DOMUtil.removeClass(this.inputField, "UpdateablePasswordFieldCapsLockWarning");
				} else {
					this._capsLockOn = true;
					DOMUtil.addClass(this.inputField, "UpdateablePasswordFieldCapsLockWarning");
				}
			} else if(event.keyCode >= 65 && event.keyCode <= 90) {
				setTimeout(this._checkForCapsLock.bind(this, event.shiftKey), 100);
			}
		} else if(Browser.Mozilla) {
			// Mozilla/Firefox type browsers don't report caps lock keypresses so we have to be a little more sneaky
			
			//Log.info("char code = " + event.charCode + " key code = " + event.keyCode + " shift key = " + event.shiftKey);
			
			if(event.charCode == 0) {
				// non-character code
				return;
			}
			
			this._capsLockOn = false;
			var keyPressed = String.fromCharCode(event.charCode);
			
			if(!isNaN(keyPressed/1)) {
				// a number - which can't be upper or lower case so we can't detect caps lock
				return;
			}
			
			//Log.info(" key pressed: " + keyPressed + " upper: " + keyPressed.toUpperCase());
			
			if(!event.shiftKey) {
				// if the key pressed is upper case then the caps lock key is down
				if(keyPressed == keyPressed.toUpperCase()) {
					this._capsLockOn = true;
				}
			}
			
			if(this._capsLockOn) {
				DOMUtil.addClass(this.inputField, "UpdateablePasswordFieldCapsLockWarning");
			} else {
				DOMUtil.removeClass(this.inputField, "UpdateablePasswordFieldCapsLockWarning");
			}
		}
	}
});
