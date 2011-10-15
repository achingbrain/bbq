include(bbq.ajax.AJAXRequest);

/**
 * @class bbq.ajax.Request
 * 
 */
bbq.ajax.Request = Class.create({
	ajaxRequest: null,
	onComplete: null,
	onError: null,
	url: null,
	
	/**
	 * @param {String} url
	 * @param {Function} onComplete
	 * @param {Function} onError
	 */
	initialize: function(url, onComplete, onError) {
		this.onComplete = onComplete;
		this.onError = onError;
		this.url = url;
		this.ajaxRequest = new bbq.ajax.AJAXRequest(this.url, this.checkSignedIn.bind(this));
	},
	
	/**
	 * This method sends Ajax request
	 * @param {String} method  Which method is used post or get
	 * @param {Object} args
	 */
	sendRequest: function(method, args) {
		this.ajaxRequest.sendRequest(method, args);
	},
	
	/**
	 * This method checks if a user is signed in
	 * @param {Object} serverResponse 
	 */
	checkSignedIn: function(serverResponse) {
		if(serverResponse.getResponseHeader('X-BBQ-ResponseType') < 0) {
			this.handleError(serverResponse);
		} else {
			this.receiveResponse(serverResponse);
		}
	},
	
	/**
	 * Warns about non-overridden call
	 */
	receiveResponse: function() {
		Log.warn("Non-overridden call to bbq.ajax.Request.receiveResponse()");
	},
	
	/**
	 * This is an error handler function
	 * @param {Object} serverResponse
	 */
	handleError: function(serverResponse) {
		if(this.onError && this.onError instanceof Function) {
			this.onError(serverResponse);
		}
	}
});
