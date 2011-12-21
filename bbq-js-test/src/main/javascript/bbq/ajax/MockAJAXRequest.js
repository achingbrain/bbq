/**
 * Add handlers to this object.  For example, to handle:
 *
 * <code>
 * new bbq.ajax.JSONRequest({
 *     url: "/foo/bar",
 *     args: {
 *          bar: "baz"
 *     },
 *     onSucces: function(serverResponse, json) {
 *          alert("server said: " + json.baz);
 *     }
 * });
 * </code>
 *
 * do this:
 *
 * <code>
 * bbq.ajax.MockAJAXRequest["/foo/bar"] = function(args) {
 *      return new bbq.ajax.MockJSONResponse({response: {
 *          baz: "qux"
 *      }});
 * }
 * </code>
 */
bbq.ajax.MockAJAXRequest = {

};

// Overwrite method that sends the AJAX request
bbq.ajax.AJAXRequest.prototype._sendRequest = function() {
	try {
		if(bbq.ajax.MockAJAXRequest[this.options.url]) {
			var handler = bbq.ajax.MockAJAXRequest[this.options.url];

			var result = handler(this.options.args);

			this._onSuccess(result);
		}
	} catch(e) {

	}

	this._onFailure();
};
