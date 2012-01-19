/**
 * @class bbq.gui.form.transformer.StringTokeniserTransformer
 */
bbq.gui.form.transformer.StringTokeniserTransformer = new Class.create(/** @lends bbq.gui.form.transformer.StringTokeniserTransformer.prototype */ {
	_delimiter: ",",
	_space: " ",

	/**
	 * Lets you take a string, "one, two, three" and return ["one", "two", "three"]
	 *
	 * @constructs
	 * @example
	 * <pre><code class="language-javascript">
	 * var field = new bbq.gui.form.TextField();
	 * field.setTransformer(new bbq.gui.form.transformer.StringTokeniserTransformer());
	 * field.setValue("one, two, three");
	 *
	 * // returns ["one", "two", "three"]
	 * field.getValue();
	 * </code></pre>
	 * @example
	 * <pre><code class="language-javascript">
	 * var field = new bbq.gui.form.TextField();
	 * field.setTransformer(new bbq.gui.form.transformer.StringTokeniserTransformer({
	 *     delimiter: "-"
	 * }));
	 * field.setValue("one-two-three");
	 *
	 * // returns ["one", "two", "three"]
	 * field.getValue();
	 * </code></pre>
	 * @param {Object} options
	 * @param {String} options.delimiter The delimiter to split the string by
	 * @param {String} options.space Used to join the split values back together along with the delimiter
	 */
	initialize: function(options) {
		if(options) {
			if(!Object.isUndefined(options.delimiter)) {
				this._delimiter = options.delimiter;
			}

			if(!Object.isUndefined(options.space)) {
				this._space = options.space;
			}
		}
	},

	/**
	 * @param {Object} value
	 * @returns {Object} Returns the transformed value
	 */
	transform: function(value) {
		var output = [];

		value.split(this._delimiter).each(function(part) {
			part = part.strip();

			if(part) {
				output.push(part);
			}
		});

		return output;
	},

	deTransform: function(value) {
		return value.join(this._delimiter + this._space);
	}
});
