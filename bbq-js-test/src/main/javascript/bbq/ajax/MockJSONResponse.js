/**
 * @param options
 *      headers: Object
 *      response: Object
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
				this._headers[key] = options.headers[key];
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
