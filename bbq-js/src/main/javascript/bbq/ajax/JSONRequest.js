include(bbq.ajax.AJAXRequest);
include(bbq.gui.error.ServerError);
include(bbq.lang.TreeWalker);

/**
 * @class bbq.ajax.JSONRequest is a subclass of bbq.ajax.AJAXRequest
 * @extends bbq.ajax.AJAXRequest
 */
bbq.ajax.JSONRequest = Class.create(bbq.ajax.AJAXRequest, {

	initialize: function($super, options) {
		// override content type
		options.contentType = "application/json";
		
		$super(options);
	},

	/**
	 * @param	{String}		handlerName
	 * @param	{Object}		args
	 */
	_callHandler: function($super, handlerName, args) {
		var serverResponse = args[0];
		var json = {};
		var contentType = serverResponse.getHeader("Content-Type");

		if(contentType && contentType.indexOf("application/json") != -1 && serverResponse.responseText != "") {
			// only attempt decode JSON if the response content type is application/json
			try {
				json = serverResponse.responseText.evalJSON(true);
			} catch(e) {
				Log.error("Error de-escaping JSON", e);
			}
		}

		$super(handlerName, [serverResponse, json]);
	},

	_getPostBody: function() {
		return Object.toJSON(this.options.args);
	},

	_createRequestHeaders: function() {
		return {
			"Accept": "application/json;charset=UTF-8"
		};
	}
});
