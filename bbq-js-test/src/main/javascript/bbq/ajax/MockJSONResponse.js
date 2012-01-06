/**
 * To be used in concert with bbq.ajax.MockAJAXRequest.  Instances of this
 * class should be returned by anonymous functions added to the
 * bbq.ajax.MockAJAXRequest object.
 *
 * @class bbq.ajax.MockJSONResponse
 * @param options
 *      headers: Object
 *      response: Object
 * @see bbq.ajax.MockAJAXRequest
 */
bbq.ajax.MockJSONResponse = Class.create({
	_headers: null,

	initialize: function(options) {
		this._headers = {
			"Content-Type": "application/json",
			"X-BBQ-ResponseType": 100
		};

		if(options.headers) {
			for(var key in options.headers) {
				if(options.headers[key]) {
					this._headers[key] = options.headers[key];
				}
			}
		}

		this.responseText = options.response.toJSON();
	},

	getHeader: function(key) {
		return this._headers[key];
	},

	getResponseHeader: function(key) {
		return this.getHeader(key);
	}
});
