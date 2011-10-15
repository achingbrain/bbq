include(bbq.gui.GUIWidget);

/**
 * @class bbq.gui.ProgressBar 
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.ProgressBar = new Class.create(bbq.gui.GUIWidget, {
	_bar: null,
	
	/**
	 * Constructor
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("ProgressBar");
		
		if(Object.isUndefined(this.options.size)) {
			this.options.size = 100;
		}
		
		if(Object.isUndefined(this.options.barText)) {
			this.options.barText = "";
		}
		
		this._bar = DOMUtil.createTextElement("span", DOMUtil.createTextElement("em", this.options.barText));
		DOMUtil.setStyle(this._bar, "width", this.options.size + "px");
		
		this.appendChild(this._bar);
	},
	
	setBarSize: function(size) {
		if(Object.isUndefined(size)) {
			size = 100;
		}
		
		DOMUtil.setStyle(this._bar, "width", size+"px");
	},
	
	setBarText: function(text) {
		if(Object.isUndefined(text)) {
			text = "";
		}
		
		this.empty();
		this._bar = DOMUtil.createTextElement("span", DOMUtil.createTextElement("em", text));
		this.appendChild(this._bar );
	},
	
	setBarTextAndSize: function(text, size) {
		this.setBarText(text);
		this.setBarSize(size);
		this.render();
	}
});
