include(bbq.util.PersistenceUtil);

/**
 * User preferences mechanism.
 * 
 * Uses HTML5 localStorage where available otherwise
 * falls back to cookies.
 * 
 * <code>
 * var foo = {bar: "baz"};
 * 
 * Preferences.set("wibble", foo);
 * 
 * ... time passes ...
 * 
 * var foo = Preferences.get("wibble");
 * 
 * alert(foo.bar);
 * 
 * </code>
 */
Preferences = {
	/**
	 * Holds a Preferences implementation.  Should support three methods:
	 * 
	 * set(key:String, value:String):Void
	 * get(key:String):String
	 * del(key:String)
	 * 
	 * Value will be JSON encoded prior to being set and decocde after get.
	 */
	implementation: null,
	
	/**
	 * Pass in a value to persist under the passed key
	 */
	set: function(key, value) {
		if(value) {
			this.implementation.set(key, PersistenceUtil.serialize(value));
		} else {
			this.implementation.del(key);
		}
	},
	
	/**
	 * Pass in a key to retrieve the stored value with an option value to set as the default
	 * in case the value stored is undefined.
	 */
	get: function(key, defaultValue) {
		var value = this.implementation.get(key);

		if(value == null && !Object.isUndefined(defaultValue)) {
			Preferences.set(key, defaultValue);

			return defaultValue;
		}
		
		// if a string returned, decode it
		if(Object.isString(value)) {
			return PersistenceUtil.deserialize(value);
		}
		
		return value;
	},
	
	/**
	 * Deletes the value stored under the passed key
	 */
	del: function(key) {
		this.implementation.del(key);
	},
	
	/**
	 * Preferences implementation that uses HTML5 storage.
	 * 
	 * Used when the browser supports it.
	 */
	_localStorage: {
		set: function(key, value) {
			localStorage.setItem(key, value);
		},
		
		get: function(key) {
			return localStorage.getItem(key);
		},
		
		del: function(key) {
			localStorage.removeItem(key);
		}
	},
	
	/**
	 * Preferences implementation that uses cookie storage.
	 * 
	 * Used when the browser doesn't support HTML5.
	 */
	_cookies: {
		set: function(key, value) {
			Cookie.set(key, value);
		}, 
		
		get: function(key) {
			return Cookie.get(key);
		}, 
		
		del: function(key) {
			Cookie.del(key);
		}
	}
};

// set preferences implementation according to browser support
if(window.localStorage) {
	// use HTML5 session storage
	Preferences.implementation = Preferences._localStorage;
} else {
	// fallback to cookies
	Preferences.implementation = Preferences._cookies;
}
