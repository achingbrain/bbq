include(bbq.gui.error.NotLoggedIn);
include(bbq.gui.error.ServerError);
include(bbq.util.BBQUtil);

/**
 * Wrapper for Prototype Ajax class.
 * 
 * Adds extras such as an independent server timeout and error handling
 * @class bbq.ajax.AJAXRequest
 * 
 */
bbq.ajax.AJAXRequest = Class.create({
	options: null,
	_timeOut: null,
	_interval: null,

	/**
	 * Constructor
	 * 
	 * @param	{Object} options	The URL to send the request to
	 * 
	 * @example
	 * Supports the following options:
	 * options {
	 * 		url:	String						// where to send the request to
	 * 		method: String					// post or get
	 * 		args: Object						// key->value pairs to convert to query string
	 * 		onSuccess: Function			// Everything went as expected - eg. received HTTP 200
	 * 		onFailure: Function				// The call failed - eg. did not receive HTTP 200
	 * 		onException: Function			// An exception was thrown while attemping to make the call
	 * 		onAnything: Function			// invoked when there's no other callback to invoke
	 * }
	 */
	initialize: function(options) {
		this.options = options;
		
		if(!this.options.method) {
			this.options.method = "post";
		}
		
		if(!this.options.args) {
			this.options.args = {};
		}
		
		if(!this.options.headers) {
			this.options.headers = {};
		}
		
		this._sendRequest();
	},
	
	_getPostBody: function() {
		return this.options.postBody;
	},
	
	/**
	 * Sends the request via the specified method
	 * 
	 * @return	void
	 */
	_sendRequest: function() {
		try {
			var requestHeaders = this._createRequestHeaders();
			
			for(var key in requestHeaders) {
				this.options.headers[key] = requestHeaders[key];
			}
			
			var request = new Ajax.Request(this.options.url, {
				method: this.options.method, 
				postBody: this._getPostBody(),
				onSuccess: this._onSuccess.bind(this),
				onFailure: this._onFailure.bind(this),
				onExcepton: this._onException.bind(this),
				requestHeaders: this.options.headers,
				contentType: this.options.contentType
			});
			
			if(typeof(firebug) != "undefined" && firebug.watchXHR instanceof Function) {
				// enable firebug lite to watch the ajax call status
				request.transport._name = this.options.method.toUpperCase() + ' ' + this.options.url;
				firebug.watchXHR(request.transport);
			}
			
			// get time out data from server configuration
			if(typeof(ServerConfig) != "undefined" && ServerConfig["timeout"]) {
				this._timeOut = ServerConfig["timeout"];
			} else {
				this._timeOut = 30;
			}
			
			// check timeout every second
			this._interval = setInterval(this._checkTimeOut.bind(this), 1000);
			
			if(typeof(NotificationArea) != "undefined") {
				NotificationArea.startLoad();
			}
		} catch(e) {
			Log.error("Could not send request", e);
		}
	},
	
	_createRequestHeaders: function() {
		return {
			
		};
	},
	
	/**
	 * @access	protected
	 * @param {String} handlerName
	 * @param {Object} args
	 */
	_callHandler: function(handlerName, args) {
		try {
			if(typeof(NotificationArea) != "undefined") {
				NotificationArea.stopLoad();
			}
			
			clearInterval(this._interval);
			
			if(this.options[handlerName] && this.options[handlerName] instanceof Function) {
				this.options[handlerName].apply(this, args);
			} else if(this.options["onAnything"] && this.options["onAnything"] instanceof Function) {
				this.options["onAnything"].apply(this, args);
			}
		} catch(e) {
			Log.error("Error encountered while invoking handler " + handlerName, e);
		}
	},
	
	/**
	 * @param {Object} serverResponse
	 */
	_onSuccess: function(serverResponse) {
		try {
			var responseType = serverResponse.getResponseHeader("X-BBQ-ResponseType");

			if(responseType < 0) {
				if(this.options.onFailure) {
					// have been passed a failure callback
					this._onFailure(serverResponse);
				} else {
					// fall back to default behaviour
					var code = "error" + responseType;
					var handler = bbq.ajax.AJAXRequest.errorHandlers[code];

					if (handler && handler instanceof Function) {
						handler.call(this, this, serverResponse);
					} else {
						Log.error("Received error code " + responseType + " but have no handler to handle it.");
						Log.error("Either pass an onFaliure callback to this bbq.ajax.AJAXRequest or define bbq.ajax.AJAXRequest.errorHandlers['" + code + "'] = function(serverResponse) { ... };");
					}
				}

				return;
			}

			this._callHandler("onSuccess", $A(arguments));
		} catch(e) {
			Log.error("Could not invoke onSuccess handler", e);
		}
	},
	
	_onFailure: function() {
		try {
			Log.error('Request to ' + this.options.method.toUpperCase() + ' ' + this.options.url + " failed");
			this._callHandler("onFailure", $A(arguments));
		} catch(e) {
			Log.error("Could not invoke onFaliure handler", e);
		}
	},
	
	_onException: function() {
		try {
			Log.error('Request to ' + this.options.method.toUpperCase() + ' ' + this.options.url + " threw exception");
			this._callHandler("onException", $A(arguments));
		} catch(e) {
			Log.error("Could not invoke onException handler", e);
		}
	},
	
	/**
	 * Checks to see if the timer has reached 0.  If so the server request has timed out.
	 * 
	 * @return	void
	 */
	_checkTimeOut: function() {
		if(this._timeOut == 0) {
			this._timedOut();
			clearInterval(this._interval);
		} else {
			this._timeOut--;
		}
	},
	
	/**
	 * Shows the user a warning
	 * 
	 * @return	void
	 */
	_timedOut: function() {
		Log.warn("Ajax call to " + this.options.url + " timed out");
		
		if(typeof(NotificationArea) != "undefined" && typeof(Language) != "undefined" && Language.get instanceof Function) {
			NotificationArea.stopLoad();
			NotificationArea.setMessage(
				Language.get("bbq.ajax.AJAXRequest.ajaxtimeoutheader"), 
				Language.get("bbq.ajax.AJAXRequest.ajaxtimeoutmessage"), 
				"error"
			);
			NotificationArea.setMessage(
				Language.get("bbq.ajax.AJAXRequest.reloadpageheader"), 
				Language.get("bbq.ajax.AJAXRequest.reloadpagemessage"), 
				"error"
			);
		}
	}
});

/**
 * Add custom error handlers to this map.  Error handlers should
 * be a function with the following signature:
 * 
 * <code>
 * function(bbq.ajax.AJAXRequest, serverResponse);
 * </code>
 */
bbq.ajax.AJAXRequest.errorHandlers = {};
bbq.ajax.AJAXRequest.errorHandlers["error-100"] = function(request, response) {
	var errorMessage = new bbq.gui.error.ServerError({
		url: request.options.url,
		args: request.options.args,
		serverResponse: BBQUtil.urlDecode(response.getResponseHeader("X-bbq-responseMessage"))
	});
	errorMessage.appear();
};
bbq.ajax.AJAXRequest.errorHandlers["error-99"] = function(request, response) {
	var errorMessage = new bbq.gui.error.NotLoggedIn();
	errorMessage.appear();
};
