include(bbq.gui.error.FatalError);

/**
 * @class bbq.gui.error.ServerError
 * @extends bbq.gui.error.FatalError
 */
bbq.gui.error.ServerError = new Class.create(bbq.gui.error.FatalError, {
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
		
		options.height = 500;
		
		$super(options);
		
		this.addClass("ServerError");
	},
	
	getMessage: function($super) {
		var documentFragment = document.createDocumentFragment();
		documentFragment.appendChild(DOMUtil.createTextElement("p", $super()));
		
		var errorDiv = DOMUtil.createTextElement("div", [
			DOMUtil.createTextElement("p", Language.get("bbq.gui.error.ServerError.time"), {className:"ServerError_diagnosticHeader"}),
			DOMUtil.createTextElement("pre", new Date().toGMTString()),
			DOMUtil.createTextElement("p", Language.get("bbq.gui.error.ServerError.url"), {className:"ServerError_diagnosticHeader"}),
			DOMUtil.createTextElement("pre", this.options.url),
			DOMUtil.createTextElement("p", Language.get("bbq.gui.error.ServerError.request"), {className:"ServerError_diagnosticHeader"}),
			DOMUtil.createTextElement("pre", Object.toJSON(this.options.args)),
			DOMUtil.createTextElement("p", Language.get("bbq.gui.error.ServerError.response"), {className:"ServerError_diagnosticHeader"}),
			DOMUtil.createTextElement("pre", this.options.serverResponse)
		], {className: "ServerError_errorDisplay"});
		
		documentFragment.appendChild(errorDiv);
		
		return documentFragment;
	}
});