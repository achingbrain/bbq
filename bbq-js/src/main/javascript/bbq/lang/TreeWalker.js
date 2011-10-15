
/**
 * @class bbq.lang.TreeWalker
 */
bbq.lang.TreeWalker = new Class.create({

	/**
	 * @param {Object} options
	 *
	 * Supports the following options:
	 *
	 * options: {
	 *		 target: Object			The object to walk
	 *		 callback: Function		A function taking the graph member as an argument and returning the new value
	 * }
	 */
	initialize: function(options) {
		this._options = options;

		if(this._options.target) {
			this._walk(this._options.target);
		}
	},

	_walk: function(args) {
		if (!args ||
				Object.isFunction(args) || 
				Object.isString(args) ||
				Object.isNumber(args) ||
				args === true ||
				args === false
		) {
			return;
		}

		if (Object.isArray(args)) {
			for (var i = 0; i < args.length; i++) {
				args[i] = this._options.callback(args[i]);

				this._walk(args[i]);
			}
		} else if (Object.isHash(args)) {
			args.keys().each(function(key) {
				args.set(key, this._options.callback(args.get(key)));

				this._walk(args.get(key));
			}.bind(this));
		} else {
			for (var key in args) {
				args[key] = this._options.callback(args[key]);

				this._walk(args[key]);
			}
		}
	}
});
