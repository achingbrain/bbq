include(bbq.util.BBQUtil);

bbq.gui.form.validator.URLValidator = new Class.create(/** @lends bbq.gui.form.validator.URLValidator.prototype */ {

	/**
	 * Ensures that the field contains a valid URL.  For our purposes a valid URL has a protocol and
	 * a hierarchical part, e.g. prototcol://hierarchical
	 *
	 * @constructs
	 * @example
	 * <pre><code class="language-javascript">
	 * var field = new bbq.gui.form.TextField();
	 * field.addValidator(new bbq.gui.form.validator.EmailValidator());
	 * field.setValue("foo");
	 *
	 * // throws an exception
	 * field.getValue();
	 *
	 * field.setValue("http://bar.com");
	 *
	 * // will not throw an exception
	 * field.getValue();
	 * </code></pre>
	 */
	initialize: function() {

	},

	/**
	 * Validates the passed value.
	 *
	 * @param {Object] value The value to validate
	 * @returns {String} An error code.  Returns null if no error occurred.
	 */
	validate: function(value) {
		if(value && value.indexOf("://") == -1) {
			return "url.invalid";
		}
	}
});
