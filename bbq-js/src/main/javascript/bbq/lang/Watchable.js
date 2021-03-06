include(bbq.util.BBQUtil);
include(bbq.util.Log);

bbq.lang.Watchable = new Class.create(/** @lends bbq.lang.Watchable.prototype */ {
	/**
	 * Storage for callbacks registered on this object
	 *
	 * @type {Object}
	 */
	_callbacks: null,

	/**
	 * @constructs
	 */
	initialize: function() {
		this._callbacks = {};
	},

	/**
	 * Returns a callback array, initialising it where necessary
	 * 
	 * @param {String} type
	 * @return {Array}
	 */
	_getCallbacks: function(type) {
		if(Object.isUndefined(this._callbacks[type])) {
			this._callbacks[type] = new Hash();
		}

		return this._callbacks[type];
	},

	/**
	 * @example
	 * <pre><code class="language-javascript">
	 * this._dropDown.registerListener("onchange", this._subTypeChanged.bind(this));
	 * </code></pre>
	 * @param {String} type
	 * @param {Function} callback
	 */
	registerListener: function(type, callback) {
		var callbackKey = BBQUtil.generateGUID();
		this._getCallbacks(type).set(callbackKey, callback);

		return callbackKey;
	},

	/**
	 * Similar to Watchable.registerListener except the callback will only be called once
	 * 
	 * @example
	 * <pre><code type="language-javascript">
	 * this._dropDown.registerOneTimeListener("onchange", this._subTypeChanged.bind(this));
	 * </code></pre>
	 * @param {String} type
	 * @param {Function} callback
	 */
	registerOneTimeListener: function(type, callback) {
		callback.__oneTime = true;

		return this.registerListener(type, callback);
	},

	/**
	 * @param {String} type
	 * @param {Function} callback
	 */
	deRegisterListener: function(type, callback) {
		if(callbackKey) {
			return this._getCallbacks(type).unset(callback) ? true : false;
		}

		return false;
	},

	/**
	 * Notifies this object's listeners of an event.
	 * 
	 * <pre><code type="language-javascript">
	 * watchable.registerListener("myEvent", function() {
	 *    alert("hello");
	 * });
	 * 
	 * watchable.notifyListeners("myEvent");
	 * // alerts "hello"
	 * </code></pre>
	 * 
	 * By default the watchable is passed as the first argument to the callback function.  If you wish to pass extra arguments, do the following:
	 * 
	 * <pre><code type="language-javascript">
	 * watchable.registerListener("myEvent", function(theWatchable, someArg) {
	 *     alert(someArg);
	 * });
	 * 
	 * watchable.notifyListeners("myEvent", "bob");
	 * // alerts "bob"
	 * </code></pre>
	 * 
	 * @param {String} type
	 * @param {...} args
	 */
	notifyListeners: function() {
		var args = [this];
		var type = "";

		for(var i = 0; i < arguments.length; i++) {
			if(i == 0) {
				type = arguments[i];
			} else {
				args.push(arguments[i]);
			}
		}

		if(Object.isUndefined(this._getCallbacks(type))) {
			return;
		}

		this._getCallbacks(type).keys().each(function(key) {
			this.notifyListener(type, key, args);
		}.bind(this));

		// notify global listeners
		bbq.lang.Watchable.notifyGlobalListeners.apply(this, arguments);
	},

	/**
	 * Calls the passed callback and deregisters it if it's a one time listener.
	 * 
	 * @param {String} type The event type
	 * @param {String} key The callback key
	 * @param {Array} args Arguments to pass to the callback
	 */
	notifyListener: function(type, key, args) {
		var callback = this._getCallbacks(type).get(key);

		if(!callback) {
			return;
		}

		try {
			callback.apply(this, args);
		} catch(e) {
			Log.error("Error invoking callback " + type + " key " + key, e);
		}

		if(callback.__oneTime) {
			this.deRegisterListener(type, key);
		}
	}
});

/**
 * Storage for global callbacks
 */
bbq.lang.Watchable._globalCallbacks = {};

bbq.lang.Watchable._getGlobalCallbacks = function(type) {
	if(!Object.isArray(bbq.lang.Watchable._globalCallbacks[type])) {
		bbq.lang.Watchable._globalCallbacks[type] = [];
	}

	return bbq.lang.Watchable._globalCallbacks[type];
}

/**
 * Allows us to register for any type of callback called on any object
 *
 * @param {String} type
 * @param {Function} callback
 */
bbq.lang.Watchable.registerGlobalListener = function(type, callback) {
	bbq.lang.Watchable._getGlobalCallbacks(type).push(callback);
};

/**
 * Notifies global listeners.
 */
bbq.lang.Watchable.notifyGlobalListeners = function() {
	var args = [this];
	var type = "";

	for(var i = 0; i < arguments.length; i++) {
		if(i == 0) {
			type = arguments[i];
		} else {
			args.push(arguments[i]);
		}
	}

	var callbacks = bbq.lang.Watchable._getGlobalCallbacks(type);

	for(var i = 0; i < callbacks.length; i++) {
		try {
			callbacks[i].apply(this, args);
		} catch(e) {
			Log.error("Error invoking callback on global listeners", e);
		}
	}
};
