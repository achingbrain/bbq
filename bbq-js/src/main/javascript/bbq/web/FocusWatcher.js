/**
 * @class FocusWatcher
 */
FocusWatcher = {
	/**
	 * The bbq.gui.GUIWidget object that thinks it currently has focus
	 * 
	 * @private
	 */
	_focusedElement: null,
	
	/**
	 * Watches the current page for keypress events and passes them on to the GUIWidget that currently has focus
	 */
	_keypress: function(event) {
		FocusWatcher._call("processKeypress", event);
	},
	
	/**
	 * Called when the window loses focus.
	 * 
	 * @private
	 */
	_pageBlurred: function(event) {
		FocusWatcher._call("loseFocus");
	},
	
	/**
	 * Called when the window gains focus.
	 * 
	 * @private
	 */
	_pageFocused: function(event) {
		FocusWatcher._call("acceptFocus");
	},
	
	/**
	 * Called manually to route observed keypress events to the passed callback function.  The passed argument should
	 * implement three methods:
	 * 
	 * loseFocus()
	 * acceptFocus()
	 * processKeypress(Event)
	 * 
	 * @param	{Object}		obj
	 */
	setKeypressCallbackObject: function(obj) {
		FocusWatcher._call("loseFocus");
		FocusWatcher._focusedElement = obj;
		FocusWatcher._call("acceptFocus");
	},
	
	/**
	 * Returns the currently focused element
	 */
	getKeypressCallbackObject: function(guiWidget) {
		return FocusWatcher._focusedElement;
	},
	
	_call: function(func, event) {
		if(FocusWatcher._focusedElement && FocusWatcher._focusedElement[func]) {
			if(typeof(event) != "undefined") {
				FocusWatcher._focusedElement[func](event);	
			} else {
				FocusWatcher._focusedElement[func]();
			}
		}
	}
}

// start observing the document for keypresses
Event.observe(document, "keypress", FocusWatcher._keypress.bindAsEventListener(this));
Event.observe(window, "blur", FocusWatcher._pageBlurred.bindAsEventListener(this));
Event.observe(window, "focus", FocusWatcher._pageFocused.bindAsEventListener(this));