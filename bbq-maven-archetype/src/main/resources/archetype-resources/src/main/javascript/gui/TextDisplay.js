#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
include(bbq.gui.GUIWidget);

${package}.gui.TextDisplay = new Class.create(bbq.gui.GUIWidget, {
	_text: null,
	
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("TextDisplay");
		
		this._text = options.text;
	},
	
	setText: function(text) {
		this._text = text;
	},
	
	render: function($super) {
		this.empty();
		this.appendChild(this._text);
	}
});
