include(bbq.gui.error.FatalError);

/**
 * @class bbq.gui.error.NotLoggedIn
 * @extends bbq.gui.error.FatalError
 */
bbq.gui.error.NotLoggedIn = new Class.create(bbq.gui.error.FatalError, {
	
	initialize: function($super, options) {
		if(!options) {
			options = {};
		}
		
		options.height = 120;
		options.noReload = true;
		
		$super(options);
		
		this.addClass("NotLoggedIn");
		
		setTimeout(function() {
			document.location = "/";
		}, 5000);
	},
	
	getHeader: function() {
		return "Not logged in";
	},
	
	getMessage: function() {
		var documentFragment = document.createDocumentFragment();
		documentFragment.appendChild(DOMUtil.createTextElement("p", Language.get("bbq.gui.error.NotLoggedIn.notloggedin")));
		
		return documentFragment;
	}
});