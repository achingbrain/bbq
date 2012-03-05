include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

bbq.gui.button.GUIButton = Class.create(bbq.gui.GUIWidget, /** @lends bbq.gui.button.GUIButton.prototype */ {
	_disabled: false,
	_down: false,
	_mouseDownOverButton: false,

	/*
	 * event onClick
	 * event onMouseOut
	 * event onMouseOver
	 * event onMouseDown
	 * event onMouseUp
	 * event onButtonDown
	 * event onButtonUp
	 */
	/**
	 * This class creates a link which can be used to receive onclick events.
	 *
	 * @constructs
	 * @extends bbq.gui.GUIWidget
	 * @example
	 * <pre><code class="language-javascript">
	 * var button = new bbq.gui.button.GUIButton({
	 *     text: "Click me",
	 *     onClick: function() {
	 *         Log.info("The button was clicked!");
	 *     }
	 * });
	 * </code></pre>
	 * @param {Object} options
	 * @param {String} options.text This text will be displayed on the button.
	 * @param {String} [options.toolTip] Will be displayed as a tooltip when the user hovers their mouse over the button.
	 * @param {String} [options.anchor] The anchor will be set as the href value of the root node.
	 * @param {boolean} [options.startDisabled] If true the button will not respond to clicks.
	 * @param {boolean} [options.startDown] If true the button will start in the down state.
	 * @param {boolean} [options.rememberDownState] If true the button will toggle on and off.
	 * @param {Function} [options.onClick] Will be invoked when onclick events occur.
	 * @param {Function} [options.onMouseOut] Will be invoked when onmouseout events occur.
	 * @param {Function} [options.onMouseOver] Will be invoked when onmouseover events occur.
	 * @param {Function} [options.onMouseDown] Will be invoked when onmousedown events occur.
	 * @param {Function} [options.onMouseUp] Will be invoked when onmouseup events occur.
	 * @param {Function} [options.onButtonDown] Will be invoked when the button enters the down state.
	 * @param {Function} [options.onButtonUp] Will be invoked when the button enters the up state.
	 */
	initialize: function($super, options) {
		$super(options);

		this._setUpRootNode();

		this.addClass("GUIButton");
		this.setDisabled(this.options.startDisabled);
		this.setDown(this.options.startDown);
		this.getRootNode().onclick = this.buttonClicked.bindAsEventListener(this);
		this.getRootNode().onmouseout = this.mouseOut.bindAsEventListener(this);
		this.getRootNode().onmouseover = this.mouseOver.bindAsEventListener(this);
		this.getRootNode().onmousedown = this.mouseDown.bindAsEventListener(this);
		this.getRootNode().onmouseup = this.mouseUp.bindAsEventListener(this);

		if(this.options.onClick) {
			this.registerListener("onClick", this.options.onClick);
		}

		if (this.options.onMouseOut) {
			this.registerListener("onMouseOut", this.options.onMouseOut);
		}

		if (this.options.onMouseOver) {
			this.registerListener("onMouseOver", this.options.onMouseOver);
		}

		if (this.options.onMouseDown) {
			this.registerListener("onMouseDown", this.options.onMouseDown);
		}

		if (this.options.onMouseUp) {
			this.registerListener("onMouseUp", this.options.onMouseUp);
		}

		if (this.options.onButtonDown) {
			this.registerListener("onButtonDown", this.options.onButtonDown);
		}

		if (this.options.onButtonUp) {
			this.registerListener("onButtonUp", this.options.onButtonUp);
		}
	},

	_setUpRootNode: function() {
		this.setRootNode("a");

		if (this.options.text) {
			this.appendChild(this.options.text);
		}

		if (this.options.toolTip) {
			this.setAttribute("title", this.options.toolTip);
		}

		if (this.options.anchor) {
			this.setAttribute("href", this.options.anchor);
		} else {
			this.setAttribute("href", ".");
		}
	},

	/**
	 * Button clicked handler function
	 *
	 * @param {Event} event
	 */
	buttonClicked: function(event) {
		if(event) {
			if(this.options.onClick) {
				Event.stop(event);
			}

			BBQUtil.clearFocus(event);
		}

		if(this._disabled || this._down) {
			return false;
		}

		if(this.options.rememberDownState) {
			this.setDown(true);
		}

		this.notifyListeners("onClick");

		// should we let the link take us to another page?
		if(this.options.anchor) {
			return true;
		}

		return false;
	},

	/**
	 * Mouse out handler function
	 *
	 * @param {Event} event
	 */
	mouseOut: function(event) {
		if(this._disabled) {
			return false;
		}

		this.removeClass("buttonOver");
		this.notifyListeners("onMouseOut");

		// mouse button was clicked, but user dragged out of button before releasing
		if(this._mouseDownOverButton) {
			this.removeClass("buttonDown");
		}
	},

	/**
	 * Mouse over handler function
	 *
	 * @param {Event} event
	 */
	mouseOver: function(event) {
		if(this._disabled) {
			return false;
		}

		this.addClass("buttonOver");
		this.notifyListeners("onMouseOver");
	},

	/**
	 * Mouse down handler function
	 *
	 * @param {Event} event
	 */
	mouseDown: function(event) {
		if(this._disabled || this._down) {
			return false;
		}

		if(!this.options.rememberDownState) {
			this.addClass("buttonDown");
		}

		this._mouseDownOverButton = true;

		this.notifyListeners("onMouseDown");
	},

	/**
	 * Mouse up handler function
	 *
	 * @param {Event} event
	 */
	mouseUp: function(event) {
		if(this._disabled || this._down) {
			return false;
		}

		this._mouseDownOverButton = false;

		this.removeClass("buttonDown");
		this.notifyListeners("onMouseUp");
	},

	/**
	 * Down state setter
	 *
	 * @param {boolean} down
	 */
	setDown: function(down) {
		if(this._down == down) {
			return;
		}

		this._down = down;
		this[(this._down ? "add" : "remove") + "Class"]("buttonDown");
		this.notifyListener("onButton" + (this._down ? "Down" : "Up"));
	},

	/**
	 * Clears button down state.
	 */
	clearDown: function() {
		this._down = false;
		this.removeClass("buttonDown");
	},

	/**
	 * Checks if button is down.
	 *
	 * @return {boolean}
	 */
	isDown: function() {
		return this._down;
	},

	/**
	 * Button disabled status setter.
	 *
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		this._disabled = disabled;
		this[(this._disabled ? "add" : "remove") + "Class"]("buttonDisabled");
		this[(this._disabled ? "remove" : "add") + "Class"]("buttonEnabled");
	},

	/**
	 * @returns {boolean} True if the button is in the disabled state.
	 */
	isDisabled: function() {
		return this._disabled;
	},

	/**
	 * Sets the text displayed on the button.
	 *
	 * @param {String} text
	 */
	setText: function(text) {
		this.empty();
		this.appendChild(text);
	}
});
