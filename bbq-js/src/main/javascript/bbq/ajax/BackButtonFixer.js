

/**
 * @class bbq.ajax.BackButtonFixer
 */
bbq.ajax.BackButtonFixer = Class.create({
	
	_lastMethod: null,
	_neediFrameFix: null,
	_controller: null,
	_iFrameURL: "/js/iFrameFix.html",
	_emptyMethod: null,
	_overrideMethodCheck: null,
	
	/*
	 * Constructor
	 * @param {Object} controller
	 * @param {boolean} emptyMethod
	 * 
	 */
	initialize: function(controller, emptyMethod) {
		// the object to call methods on
		this._controller = controller;
		
		// the method to call to return the page to it's initial state
		if(emptyMethod) {
			this._emptyMethod = emptyMethod;
		}
		
		// have we been loaded with a method request
		this._lastMethod = this._getMethod();
		
		// stupid IE
		this._neediFrameFix = Browser.InternetExplorer && Browser.version < 7 ? true : false;
		
		if(this._neediFrameFix) {
			this.createiFrame(this._lastMethod);
		}
		
		// call the requested (bookmarked) method
		this._overrideMethodCheck = true;
		this._callMethod(this._lastMethod);
		
		// start checking to see if the URL has changed
		setInterval(this._checkLocation.bind(this), 100);
	},
	
	/*
	 * Creates an iFrame to add to the page
	 * @param {String} method
	 */
	createiFrame: function(method) {
		var iframe = document.createElement("iframe");
		iframe.id = "iFrameFix";
		iframe.name = "iFrameFix";
		iframe.style.display = "none";
		document.getElementsByTagName("body")[0].appendChild(iframe);
		this.loadiFrameURL(method);
	},
	
	/** looks at the URL in the address bar */
	_checkLocation: function() {
		var method = this._getMethod();
		
		if(this._lastMethod != method) { // new method call
			//alert("method = " + method + " lastMethod = " + this.lastMethod);
			
			if(this._neediFrameFix) {
				this.loadiFrameURL(method);
			} else {
				this._callMethod(method);
			}
		}
	},
	
	/*
	 * gets the method name from the passed argument
	 * @param {String} href
	 * @param {boolean} acceptNullValue 
	 */
	_getMethod: function() {
		var method = document.location.href.split("#");
		
		if(method.length > 1) {
			return method[1];
		}
	
		return null;
	},
	
	/*
	 * loads the iFrame for crap browsers or calls the callMethod method
	 * @param {String} method
	 */
	loadiFrameURL: function(method) {
		$("iFrameFix").src = this._iFrameURL + "?time="+(new Date()).getTime() + (method != null ? "#" + method : "");
	},
	
	/*
	 * tells the iFrame to examine it's URL and tell us what the method name is
	 * @param {Object} frameWindow
	 */
	iFrameLoaded: function(frameWindow) {
		//Log.info("iframe callback");
		frameWindow.owner = this;
		frameWindow.readURLandCallMethod();
	},
	
	/* calls the passed method name - override this method
	 * @param {boolean} passed
	 */
	_callMethod: function(passed) {
		//Log.info("calling " + passed + ", last method was " + this.lastMethod);
		
		if(passed) {
			var query = passed.split("/");
			var method = query[0];
			var args = [];
			
			// don't call the same method twice
			if(!this._overrideMethodCheck && method == this._lastMethod) {
				this._overrideMethodCheck = false;
				return;
			}
			
			this._lastMethod = passed;
			
			// build arguments
			for(var i = 1, iCount=query.length; i < iCount; i++) {
				args[(i-1)] = query[i];
			}
			
			// make sure method exists
			if(this._controller[method]) {
				var methodToCall = this._controller[method].bind(this._controller);
				methodToCall.apply(this, args);
			} else { // tried to call non-existant method
				//Log.info("Method  " + method + " not found on controller");
			}
		} else if(this._emptyMethod) {
			//Log.info("Called empty method");
			this._emptyMethod.call();
			this._lastMethod = null;
		}
	}
});
