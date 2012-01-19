
bbq.gui.form.transformer.BooleanValueTransformer = new Class.create(/** @lends bbq.gui.form.transformer.BooleanValueTransformer.prototype */ {

	/**
	 * This class prevents transmission of 0 as false, 1 as true, etc, instead constraining
	 * them to boolean true and false values.
	 *
	 * @constructs
	 * @example
	 * <pre><code class="language-javascript">
	 * var field = new bbq.gui.form.TextField();
	 * field.setTransformer(new bbq.gui.form.transformer.BooleanValueTransformer());
	 * field.setValue("true");
	 *
	 * // returns true, not "true"
	 * field.getValue();
	 * </code></pre>
	 */
	initialize: function() {

	},

	/**
	 * Transforms the passed value into a boolean true or false.
	 *
	 * @param {Object} value
	 * @returns {Object} Returns the transformed value
	 */
	transform: function(value) {
		if(value && value.strip) {
			value = value.strip();
		}

		return value ? true : false;
	}
});
