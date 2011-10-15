include(bbq.gui.error.FatalError);

/**
 * @class bbq.gui.error.NoFlash
 * @extends bbq.gui.error.FatalError
 */
bbq.gui.error.NoFlash = new Class.create(bbq.gui.error.FatalError, {
	/**
	 * @param {mixed} options
	 * @example	
	 * Supports the following options:
	 * 
	 * options: {
	 * 		showChrome: boolean						// Whether to be draggable, show close window button, etc
	 * }
	 * 
	 */
	initialize: function($super, options) {
		if(!options) {
			options = {};
		}
		
		options.height = 200;
		options.noReload = true;
		
		$super(options);
		
		this.addClass("NoFlash");
	},
	
	getMessage: function() {
		var documentFragment = document.createDocumentFragment();
		documentFragment.appendChild(DOMUtil.createTextElement("p", Language.get("bbq.gui.error.NoFlash.noflash")));
		documentFragment.appendChild(DOMUtil.createTextElement("a", Language.get("bbq.gui.error.NoFlash.installflash"), {href: "http://www.adobe.com/go/getflashplayer", className: "NoFlash_flashLink"}));
		
		return documentFragment;
	}
});