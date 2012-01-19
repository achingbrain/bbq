bbq.gui.form.validator.NotNullValidator = new Class.create(/** @lends bbq.gui.form.validator.NotNullValidator.prototype */ {

	/**
	 * Ensures that the field does not have a null value
	 *
	 * @constructs
	 * @example
	 * <pre><code class="language-javascript">
	 * var field = new bbq.gui.form.TextField();
	 * field.addValidator(new bbq.gui.form.validator.NotNullValidator());
	 *
	 * // throws an exception
	 * field.getValue();
	 *
	 * field.setValue("foo");
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
		if(!value) {
			return "value.was.null";
		}

		if(value.strip && !value.strip()) {
			return "value.was.null";
		}
	}
});
