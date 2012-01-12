include(bbq.ajax.AJAXRequest);
include(bbq.gui.error.ServerError);
include(bbq.lang.TreeWalker);

bbq.ajax.JSONRequest = Class.create(bbq.ajax.AJAXRequest, /** @lends bbq.ajax.JSONRequest.prototype */ {

	/**
	 * Sends an asynchronous HTTP request to a server.  The passed arguments are serialized to a
	 * JSON string and the response is also expected to be a JSON string.  The request goes out
	 * as a POST request and the JSON string is sent as the request body.
	 *
	 * @example
	 *<pre><code class="language-javascript">
	 * new bbq.ajax.JSONRequest({
	 *     // The URL to send the request to - can be relative
	 *     url: "/some/path",
	 *
	 *     // The arguments to send - N.B. will be JSON serialized
	 *     args: {
	 *          foo: "bar"
	 *     }
	 *
	 *     // Invoked on success.
	 *      // The first argument is the XMLHTTPRequest object,
	 *      // the second is the deserialized server response
	 *     onSuccess: function(serverResponse, json) {
	 *
	 *     },
	 *
	 *     // Invoked when the request fails - eg. a X-BBQ-ResponseCode
	 *     // header is sent with a negative value
	 *     onFailure: function() {
	 *
	 *     }
	 * });
	 * </code></pre>
	 *
	 * @constructs
	 * @param {Object} options
	 * @extends bbq.ajax.AJAXRequest
	 */
	initialize: function($super, options) {
		// override content type
		options.contentType = "application/json";
		
		$super(options);
	},

	/**
	 * @param {String} handlerName
	 * @param {Object} args
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
