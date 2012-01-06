/**
 * @class bbq.gui.form.transformer.StringTokeniserTransformer
 */
bbq.gui.form.transformer.StringTokeniserTransformer = new Class.create({
	_delimiter: ",",
	_space: " ",

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
