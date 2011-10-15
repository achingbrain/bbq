include(bbq.gui.updateables.UpdateableTextArea);
include(bbq.gui.button.ButtonHolder);
include(bbq.gui.button.GUIButton);
include(bbq.gui.panel.ScrollableHolder);

/**
 * @class bbq.gui.updateables.UpdateableRichTextArea
 * @extends bbq.gui.updateables.UpdateableTextArea
 */
bbq.gui.updateables.UpdateableRichTextArea = new Class.create(bbq.gui.updateables.UpdateableTextArea, {
	/**
	 * @param {Object} options An options object
	 */
	initialize: function($super, options) {
		$super(options);
		this.setRootNode("div");
		this.addClass("UpdateableRichTextArea");
		this.layout = new bbq.gui.layout.Layout({expands: true});
	},
	
	/**
	 * Creates Edit field
	 */
	createEditField: function() {
		this.empty();
		
		var buttonHolder = new bbq.gui.button.ButtonHolder();
		buttonHolder.addButton(new bbq.gui.button.GUIButton({
			toolTip: Language.get("bbq.gui.updateables.UpdateableRichTextArea.boldtooltip"), 
			attributes: {
				className: "UpdateableRichTextArea_boldButton"
			}, 
			onclick: function() {
				this.inputField.contentDocument.execCommand("bold", false, null);
				this.inputField.contentDocument.body.focus();
			}.bind(this)
		}));
		buttonHolder.addButton(new bbq.gui.button.GUIButton({
			toolTip: Language.get("bbq.gui.updateables.UpdateableRichTextArea.italictooltip"), 
			attributes: {
				className: "UpdateableRichTextArea_italicButton"
			}, 
			onclick: function() {
				this.inputField.contentDocument.execCommand("italic", false, null);
				this.inputField.contentDocument.body.focus();
			}.bind(this)
		}));
		
		var controlArea = DOMUtil.createElement("div", {className: "UpdateableRichTextArea_controlArea"});
		buttonHolder.appendTo(controlArea);
		
		this.appendChild(controlArea);
		
		this.inputField = DOMUtil.createElement("iframe", {
			onkeyup: this.updateLocalValue.bindAsEventListener(this),
			onfocus: this._clearFocusWatcher.bind(this)
		});
		this.inputField.layout = new bbq.gui.layout.Layout({expands: true});
		
		// node must be in the dom before setting design mode to on
		Event.observe(this.inputField, "load", function() {
			// keeps Google Chrome happy
			var imageLocation = window.location.protocol + "//" + window.location.hostname + "/css/behaviour/gui/updateables/UpdateableRichTextArea/bg.png";
			
			this.inputField.contentDocument.body.style.background = "url(" + imageLocation + ") repeat-y 50% 0 #AFAFAF";
			this.inputField.contentDocument.body.style.padding = "20px 0";
			this.inputField.contentDocument.body.style.margin = "auto";
			this.inputField.contentDocument.body.style.width = "600px";
			this.inputField.contentDocument.body.style.font = "medium Helvetica,Arial,Verdana,Sans-serif";
			
			// possible xss injection vector
			this.inputField.contentDocument.body.innerHTML = this._getCurrentValue();
			
			this.inputField.contentDocument.designMode = "on";
			this.inputField.contentDocument.body.focus();
			
			Event.observe(this.inputField.contentDocument.body, "blur", this._processEventCallback.bindAsEventListener(this, "onblur"));
			Event.observe(this.inputField.contentDocument.body, "focus", this._processEventCallback.bindAsEventListener(this, "onfocus"));
			Event.observe(this.inputField.contentDocument.body, "change", this._processEventCallback.bindAsEventListener(this, "onchange"));
			Event.observe(this.inputField.contentDocument.body, "keydown", this._processEventCallback.bindAsEventListener(this, "onkeydown"));
			Event.observe(this.inputField.contentDocument.body, "keyup", this._processEventCallback.bindAsEventListener(this, "onkeyup"));
			Event.observe(this.inputField.contentDocument.body, "keypress", this._processEventCallback.bindAsEventListener(this, "onkeypress"));
			Event.observe(this.inputField.contentDocument.body, "click", this._processEventCallback.bindAsEventListener(this, "onclick"));
			
			Event.observe(this.inputField.contentDocument.body, "blur", function() {
				this.inputField.hasFocus = false;
			}.bind(this));
			Event.observe(this.inputField.contentDocument.body, "focus", function() {
				this.inputField.hasFocus = true;
			}.bind(this));
		}.bind(this));
		
		this.notifyListeners("onValueChanged");
		
		return this.inputField;
	},
	
	createViewField: function($super) {
		this.empty();
		
		var richTextBody = DOMUtil.createElement("div", {className: "richTextBody"});
		
		if(this.options.propertyDisplay) {
			richTextBody.innerHTML = $super().innerHTML.replace(/&amp;/g, "&").replace(/&lt;/g,"<").replace(/&gt;/g,">");
		} else {
			richTextBody.innerHTML = this.displayValue;
		}
		
		var scrollable = new bbq.gui.panel.ScrollableHolder();
		scrollable.appendChild(richTextBody);
		
		return scrollable;
	},
	
	getValue: function($super, supressErrorWarning) {
		return this.inputField.contentDocument.body.innerHTML;
	}
});
