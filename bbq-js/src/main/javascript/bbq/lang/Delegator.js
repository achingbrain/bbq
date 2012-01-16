include(bbq.lang.Watchable);

bbq.lang.Delegator = new Class.create(bbq.lang.Watchable, /** @lends bbq.lang.Delegator.prototype */ {
	/**
	 * @type {Object} Holds the options for this object
	 */
	options: null,

	/**
	 * @constructs
	 * @extends bbq.lang.Watchable
	 * @param {Object} options
	 */
	initialize: function($super, options) {
		$super();

		this.options = options ? options : {};
	},

	/**
	 * Example:
	 * 
	 * <code>
	 * if(this.willDelegateMethod("foo")) {
	 * 		return this.delegateMethod("foo");
	 * } else {
	 * 		// default action
	 * }
	 * </code>
	 * 
	 * @param {String} type
	 */
	delegateMethod: function(methodName, args) {
		if(this.willDelegateMethod(methodName)) {
			if(typeof(args) == "undefined") {
				args = [];
			}

			args.unshift(this);
			
			return this.options.delegate[methodName].apply(this, args);
		}
	},

	willDelegateMethod: function(methodName) {
		return this.options.delegate && this.options.delegate[methodName] instanceof Function;
	}
});
