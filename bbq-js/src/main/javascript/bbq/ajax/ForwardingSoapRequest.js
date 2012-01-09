include(bbq.ajax.SoapRequest);

/**
 * This class is designed to be used with the org.bbqjs.spring.ajax.RequestForwarder class
 * and attepts to work around the same origin policy of most browsers in terms of AJAX.
 *
 * The policy means that you can only dispatch an AJAX request to the server from which
 * the JavaScript dispatching the request was loaded.  So if you deliver your code from
 * http://www.example.org, you cannot make a request to http://api.google.com.
 *
 * The RequestForwarder class will forward on the request to the location specified in the
 * url property of the options argument, even if it's a different domain.
 *
 * Other than that it behaves in the same way as bbq.ajax.SoapRequest
 *
 * <pre>
 * <code class="language-javascript">
 *
 * var request = new bbq.ajax.ForwardingSoapRequest({
 *     url: "http://api.google.com",
 *     onSuccess: function(serverRequest, json) {
 *
 *     }
 *     ... // more args similar to bbq.ajax.SoapRequest
 * });
 *
 * </code>
 * </pre>
 *
 * @class bbq.ajax.ForwardingJSONRequest
 * @extends bbq.ajax.SoapRequest
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
