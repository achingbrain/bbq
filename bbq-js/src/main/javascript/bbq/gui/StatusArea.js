include(bbq.gui.GUIWidget);
include(bbq.gui.Spinner);

/**
 * @class bbq.gui.DatePicker
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.StatusArea = new Class.create(bbq.gui.GUIWidget, {
	_text: null,
	_spinner: null,
	
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("StatusArea");
		
		this._spinner = new bbq.gui.Spinner();
		this._text = DOMUtil.createElement("p");
	},
	
	render: function() {
		this.empty();
		
		this.appendChild(this._spinner);
		this.appendChild(this._text);
	},
	
	setStatus: function(text) {
		DOMUtil.removeClass(this._text, "StatusAreaError");
		this._setText(text);
	},
	
	setError: function(text) {
		DOMUtil.addClass(this._text, "StatusAreaError");
		this._setText(text);
	},
	
	startWorking: function() {
		this._spinner.setVisible(true);
	},
	
	stopWorking: function() {
		this._spinner.setVisible(false);
	},
	
	_setText: function(text) {
		DOMUtil.emptyNode(this._text);
		
		if(typeof(text) != "undefined") {
			this._text.appendChild(document.createTextNode(text));
		} else {
			this.stopWorking();
		}
	}
});
