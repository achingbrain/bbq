/**
 * For use while testing classes that make AJAX requests to a remote server.
 *
 * For example, if you are testing a bit of code that includes the following:
 *
 * <code class="javascript">
 * new bbq.ajax.JSONRequest({
 *     url: "/foo/bar",
 *     args: {
 *          bar: "baz"
 *     },
 *     onSuccess: function(serverResponse, json) {
 *          alert("server said: " + json.baz);
 *     }
 * });
 * </code>
 *
 * To handle this sort of request, you'd do the following before the AJAX
 * call is invoked:
 *
 * <code class="javascript">
 * bbq.ajax.MockAJAXRequest["/foo/bar"] = function(args) {
 *      return new bbq.ajax.MockJSONResponse({response: {
 *          baz: "qux"
 *      }});
 * }
 * </code>
 *
 * This will result in the onSuccess handler being called immediately.
 *
 * @class bbq.ajax.MockAJAXRequest
 */
bbq.ajax.MockAJAXRequest = {

};

// Overwrite method that sends the AJAX request
bbq.ajax.AJAXRequest.prototype._sendRequest = function() {
	var result;

	try {
		if(bbq.ajax.MockAJAXRequest[this.options.url]) {
			var handler = bbq.ajax.MockAJAXRequest[this.options.url];

			result = handler(this.options.args);

			this._onSuccess(result);
		}
	} catch(e) {

	}

	this._onFailure(result);
};
