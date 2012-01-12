bbq.ajax.MockJSONResponse = Class.create(/** @lends bbq.ajax.MockJSONResponse.prototype */ {
	_headers: null,

	/**
	 * To be used in concert with bbq.ajax.MockAJAXRequest.  Instances of this
	 * class should be returned by anonymous functions added to the
	 * bbq.ajax.MockAJAXRequest object.
	 *
	 * <pre><code class="language-javascript">
	 * options = {
	 *     // key/value pairs
	 *     headers: {},
	 *
	 *     // the response object - will be serialized to JSON so no functions, please...
	 *     response: {}
	 * }
	 * </code></pre>
	 *
	 * @constructs
	 * @param {Object} options
	 * @see bbq.ajax.MockAJAXRequest
	 */
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

	/**
	 * Returns the response header for the passed key
	 *
	 * @param {String} key
	 * @return {String}
	 */
	getHeader: function(key) {
		return this._headers[key];
	},

	/**
	 * Also returns the response header for the passed key
	 * 
	 * @param {String} key
	 * @return {String}
	 */
	getResponseHeader: function(key) {
		return this.getHeader(key);
	}
});
