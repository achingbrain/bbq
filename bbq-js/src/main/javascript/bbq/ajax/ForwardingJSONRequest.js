include(bbq.ajax.AJAXRequest);

/**
 * Expects response type to be valid JSON.
 *
 * Designed to be used with the org.bbqjs.spring.ajax.RequestForwarder class
 * from the bbq-spring-integration module.
 * 
 * @class bbq.ajax.ForwardingAjaxRequest is a subclass of bbq.ajax.AJAXRequest
 * @extends bbq.ajax.AJAXRequest
 */
bbq.ajax.ForwardingJSONRequest = Class.create(bbq.ajax.JSONRequest, {
	initialize: function($super, options) {
		options.forwardTo = options.url;
		options.url = "/forward";
		
		$super(options);
	},
	
	_createRequestHeaders: function() {
		return {
			"X-Content-Type": "application/json",
			"X-BBQ-Forward-To": this.options.forwardTo
		};
	}
});
