include(bbq.ajax.SoapRequest);

/**
 * Expects response type to be arbitrary data.
 *
 * Designed to be used with the org.bbqjs.spring.ajax.RequestForwarder class
 * from the bbq-spring-integration module.
 * 
 * @class bbq.ajax.ForwardingAjaxRequest is a subclass of bbq.ajax.AJAXRequest
 * @extends bbq.ajax.AJAXRequest
 */
bbq.ajax.ForwardingSoapRequest = Class.create(bbq.ajax.SoapRequest, {
	initialize: function($super, options) {
		options.forwardTo = options.url;
		options.url = "/forward";
		
		$super(options);
	},
	
	_createRequestHeaders: function($super) {
		var headers = $super();
		headers["X-BBQ-Forward-To"] = this.options.forwardTo;
		
		return headers;
	},
	
	onSuccess: function(serverResponse) {
		if(serverResponse.getResponseHeader("X-responseType") == -100) {
			this._callHandler("onError", $A(arguments));
		} else {
			this._callHandler("onSuccess", $A(arguments));
		}
	}
});
