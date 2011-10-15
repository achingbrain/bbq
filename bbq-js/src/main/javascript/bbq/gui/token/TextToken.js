include(bbq.gui.GUIWidget);
include(bbq.gui.button.DeleteButton);

/**
 * @class bbq.gui.token.TextToken 
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.token.TextToken = new Class.create(bbq.gui.GUIWidget, {
	_editMode: false,
	
	/**
	 * Constructor
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("span");
		this.addClass("TextToken");
	},
	
	/**
	 * Renders
	 */
	render: function() {
		this.empty();
		
		this.appendChild(DOMUtil.createElement("span", {className: "TextTokenText_left"}));
		this.appendChild(DOMUtil.createElement("span", {className: "TextTokenText_right"}));
		this.appendChild();
		
		var text;
		
		if(this.options.propertyDisplay) {
			text = this.options.propertyDisplay.entity.getPropertyDisplay({property: this.options.propertyDisplay.property});
		} else {
			text = DOMUtil.createTextElement("span", this.options.text);
		}
		
		DOMUtil.addClass(text, "TextTokenText");
		
		if(this._editMode && this.options.deleteCallback) {
			this.appendChild(DOMUtil.createTextElement("span", new bbq.gui.button.DeleteButton({onclick: this.options.deleteCallback}), {className: "TextTokenText_button"}));
			DOMUtil.addClass(text, "TextTokenText_withButton");
		}
		
		this.appendChild(text);
	},
	
	/**
	 * @param {boolean} mode Sets edit mode
	 */
	setEditMode: function(mode) {
		this._editMode = mode;
		this.render();
	}
});
