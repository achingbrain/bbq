include(bbq.gui.GUIWidget);
include(bbq.util.BBQUtil);

/**
 * GUIButton
 * 
 * This class creates a link which can be used to receive on click events.
 * 
 * @class bbq.gui.button.GUIButton
 * @extends bbq.gui.GUIWidget
 * 
 */
bbq.gui.button.GUIButton = Class.create(bbq.gui.GUIWidget, {
	_disabled: false,
	_down: false,

	/**
	 * Constructor!
	 * 
	 * Supports the following options: 
	 * options: {
	 *		text: String,
	 *		toolTip: String,
	 *		anchor: String,
	 * 		startDisabled: boolean,
	 * 		startDown: boolean,
	 * 		rememberDownState: boolean,
	 *		onClick: function,
	 *		onMouseOut: function,
	 *		onMouseOver: function,
	 *		onMouseDown: function,
	 *		onMouseUp: function,
	 *		onButtonDown: function
	 * }
	 *
	 * Supports observers for the following events
	 *
	 * onClick
	 * onMouseOut
	 * onMouseOver
	 * onMouseDown
	 * onMouseUp
	 * onButtonDown
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
			this.registerListener("onClick", this.options.onMouseOut);
		}

		if (this.options.onMouseOver) {
			this.registerListener("onClick", this.options.onMouseOver);
		}

		if (this.options.onMouseDown) {
			this.registerListener("onClick", this.options.onMouseDown);
		}

		if (this.options.onMouseUp) {
			this.registerListener("onClick", this.options.onMouseUp);
		}

		if (this.options.onButtonDown) {
			this.registerListener("onClick", this.options.onButtonDown);
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
	 * @param {Event} event
	 */
	buttonClicked: function(event) {
		if(event) {
			if(this.options.onclick) {
				Event.stop(event);
			}

			BBQUtil.clearFocus(event);
		}

		if(this._disabled) {
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
	 * @param {Event} event
	 */
	mouseOut: function(event) {
		if(this._disabled) {
			return false;
		}

		this.removeClass("buttonOver");
		this.notifyListeners("onMouseOut");
	},

	/**
	 * Mouse over handler function
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
	 * @param {Event} event
	 */
	mouseDown: function(event) {
		if(this._disabled) {
			return false;
		}

		this.addClass("buttonDown");
		this.notifyListeners("onMouseDown");
	},

	/**
	 * Mouse up handler function
	 * @param {Event} event
	 */
	mouseUp: function(event) {
		if(this._disabled) {
			return false;
		}

		this.removeClass("buttonDown");
		this.notifyListeners("onMouseUp");
	},

	/**
	 * Down state setter
	 * @param {boolean} down
	 */
	setDown: function(down) {
		this._down = down;
		this[(this._down ? "add" : "remove") + "Class"]("buttonDown");
		this.notifyListener("onButton" + (this._down ? "Down" : "Up"));
	},

	/**
	 * Clears button down state
	 */
	clearDown: function() {
		this.removeClass("buttonDown");
	},

	/**
	 * Checks if button is down.
	 * @return {boolean}
	 */
	isDown: function() {
		return this._down;
	},

	/**
	 * Button disabled status setter
	 * @param {boolean} disabled
	 */
	setDisabled: function(disabled) {
		this._disabled = disabled;
		this[(this._disabled ? "add" : "remove") + "Class"]("buttonDisabled");
		this[(this._disabled ? "remove" : "add") + "Class"]("buttonEnabled");
	},

	isDisabled: function() {
		return this._disabled;
	},

	setText: function(text) {
		this.empty();
		this.anchor.appendChild(document.createTextNode(text));
	}
});
