#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
include(bbq.page.Page);
include(bbq.gui.button.NativeButton);
include(bbq.ajax.JSONRequest);
include(${package}.gui.TextDisplay);

/**
 * @class ${package}.page.Hom
 * @extends bbq.page.Page
 */
${package}.page.Home = new Class.create(bbq.page.Page, {
	_textDisplay: null,
	
	/**
	 * Constructor
	 * 
	 * @param {mixed} args
	 * 
	 */
	initialize: function($super, args) {
		$super();
		
		Language.load({section: "home", postLoad: this._languageLoaded.bind(this)});
	},
	
	/**
	 * This method is called once the language file has been loaded
     * 
     * @param {XMLHTTPResonse} serverResponse
	 * @param {Object} json
	 */
	_languageLoaded: function(serverResponse, json) {
		// adds a paragraph tag to the page with a greeting
		$("content").appendChild(DOMUtil.createTextElement("p", Language.get("${package}.page.Home.greeting")));
		
        // clicking this button will invoke the _buttonClicked function below
		var button = new bbq.gui.button.NativeButton({
			text: Language.get("${package}.page.Home.button"), 
			onClick: this._buttonClicked.bind(this)
		});
		
		// add the button to the page
		button.appendTo($("content"));
		
		// will display the results of the server call
		this._textDisplay = new ${package}.gui.TextDisplay({text: ""});
		this._textDisplay.appendTo($("content"));
	},
	
	/**
	 * Callback method invoked when the button is clicked
	 * 
	 * @param {bbq.gui.button.NativeButton} button
	 * @param {Event} event
	 */
	_buttonClicked: function(button, event) {
		// send an AJAX request to the server
		new bbq.ajax.JSONRequest({
			url: "/backend/aRequest/doSomething",
			args: {
				foo: Language.get("${package}.page.Home.message")
			},
			onSuccess: this._serverResponded.bind(this)
		});
	},
	
	/**
	 * Callback method invoked when the server responds
	 * 
	 * @param {XMLHTTPResonse} serverResponse
	 * @param {Object} json
	 */
	_serverResponded: function(serverResponse, json) {
		// Language.getFormatted allows you to substitute tokens in your language translations
		this._textDisplay.setText(Language.getFormatted("${package}.page.Home.serversaid", {message: json.bar}));
		
		// calling render will update the display
		this._textDisplay.render();
	}
});
