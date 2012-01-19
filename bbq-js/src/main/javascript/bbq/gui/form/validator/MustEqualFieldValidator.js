
bbq.gui.form.validator.MustEqualFieldValidator = new Class.create(/** @lends bbq.gui.form.validator.MustEqualFieldValidator.prototype */ {
	_field: null,

	/**
	 * Ensures that the field value is the same as the field passed the constructor
	 *
	 * @constructs
	 * @example
	 * <pre><code class="language-javascript">
	 * var field1 = new bbq.gui.form.TextField({value: "foo"});
	 *
	 * var field2 = new bbq.gui.form.TextField();
	 * field2.addValidator(new bbq.gui.form.validator.MustEqualFieldValidator(field1));
	 * field2.setValue("bar");
	 *
	 * // throws an exception
	 * field2.getValue();
	 *
	 * field2.setValue(field1.getValue());
	 *
	 * // will not throw an exception
	 * field2.getValue();
	 * </code></pre>
	 */
	initialize: function(field) {
		this._field = field;
	},

	/**
	 * Validates the passed value.
	 *
	 * @param {Object] value The value to validate
	 * @returns {String} An error code.  Returns null if no error occurred.
	 */
	validate: function(value) {
		var other = this._field.getUnvalidatedValue();

		if(value != other) {
			return "does.not.match";
		}
	}
});
