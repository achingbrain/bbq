include(bbq.util.BBQUtil);

/**
 * Provides a safe way to call Javascript functions that may not exist from within a Flash movie.
 * @class SwfBridge 
 */
SwfBridge = {
	_registeredFunctions: {},
	
	/**
	 * Pass in a function and pass the returned key somewhere.
	 * 
	 * <code>
	 * 
	 * // in JavaScript
	 * var myFunc = function(foo) {alert foo};
	 * var funcKey = SwfBridge.registerFunction(myFunc);
	 * 
	 * myFlashObject.callFlashFunction("callMe", funcKey);
	 * 
	 * // in ActionScript
	 * ExternalInterface.addCallback("callMe", this, callMe);
	 * function callMe(String key):Void {
	 * 		ExternalInterface.addCallback("SwfBridge.callRegisteredFunction", key, "Hello world");
	 * }
	 * 
	 * // Alerts "Hello world"
	 * 
	 * </code>
	 * 
	 * @param {Function} A bound function
	 * @return String
	 */
	registerFunction: function(func) {
		var guid = BBQUtil.generateGUID();
		
		SwfBridge._registeredFunctions[guid] = func;
		
		return guid;
	},
	
	/**
	 * See SwfBridge#registerFunction
	 * 
	 * @param {String} key The key
	 */
	callRegisteredFunction: function(key) {
		if(typeof(SwfBridge._registeredFunctions[key]) == "function") {
			// passed a list of arguments
			if(arguments.length > 1) {
				args = $A(arguments);
				args.shift();
				
				return SwfBridge._registeredFunctions[key].apply(this, args);
			}
			
			return SwfBridge._registeredFunctions[key].call(this);
		}
		
		Log.warn("SwfBridge: Key \"" + key + "\" passed to callRegisteredFunction did not resolve to a valid function");
	},
	
	/**
	 * @param {string} functionName
	 * @param {Arrays} functionArgs
	 */
	callFunction: function(functionName, functionArgs) {
		var functionToCall = this.getFunction(functionName, window);
		
		if(typeof(functionToCall) != "undefined") {
			if(functionToCall instanceof Function) {
				if(functionArgs) {
					return functionToCall.apply(this, functionArgs);
				}
				
				return functionToCall();//.apply(functionToCall, functionArgs);
			} else {
				Log.warn("Attempt by flash to call function that is not a function - " + functionName);
			}
		} else {
			Log.warn("Attempt by flash to call non-existent function - " + functionName);
		}
	},
	
	callFunctionOnEmbed: function(withName, functionName, functionArgs) {
		if(!bbq.web.SwfEmbed.instances[withName]) {
			Log.warn("Attempt by flash to call function on instance that does not exist");
			return;
		}
		
		if(!(bbq.web.SwfEmbed.instances[withName][functionName] instanceof Function)) {
			Log.warn("Attempt by flash to call function on instance that is not a function");
			return;
		}

		//Log.info("Calling " + functionName + " on " + withName + " with args " + functionArgs);

		if(functionArgs) {
			return bbq.web.SwfEmbed.instances[withName][functionName].apply(bbq.web.SwfEmbed.instances[withName], functionArgs);
		}
		
		return bbq.web.SwfEmbed.instances[withName][functionName].call(bbq.web.SwfEmbed.instances[withName]);
	},
	
	/**
	 * @param {string} functionName
	 * @param {Object} searchObject
	 */
	getFunction: function(functionName, searchObject) {
		if(functionName.search(/\./) != -1) {
			functionName = functionName.split(".");
			
			for(var i = 0; i < functionName.length; i++) {
				searchObject = searchObject[functionName[i]];
			}
			
			return searchObject;
		} else {
			return searchObject[functionName];
		}
	},
	
	getVariable: function(varName) {
		var value = window;
		
		varName.split(".").each(function(part) {
			value = value[part];
		});
		
		return value;
	}
}
