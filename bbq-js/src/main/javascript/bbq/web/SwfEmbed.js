include(bbq.gui.GUIWidget);
include(bbq.gui.error.NoFlash);
include(bbq.util.BBQUtil);
include(bbq.web.SwfBridge);

/**
 * Uses the SWFObject library to wrapper an embedded flash movie.
 * @class bbq.web.SwfEmbed
 * @extends bbq.gui.GUIWidget 
 */
bbq.web.SwfEmbed = new Class.create(bbq.gui.GUIWidget, {
	// unique identifier used by the movie to call methods on us
	_id: null,
	_hasLoaded: false,

	/**
	 * @param {Object} options
	 * @example
	 * Supports the following options:
	 * 
	 * options {
	 * 		swf: string							// Path to the flash movie
	 * 		attributes: Object,				// Attributes to set on the Object node
	 * 		variables: {						// Variables to pass to the movie in key: value pairs
	 * 			key: value,
	 * 			...
	 * 		},
	 * 		nocache: boolean				// Whether or not to append a cache buster
	 *		wmode: string					// Specify the wmode to use
	 * }
	 * 
	 * Supports the following events:
	 * 
	 * onLoad
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._id = BBQUtil.generateGUID().replace(/-/g, "");

		bbq.web.SwfEmbed.instances[this._id] = this;
		
		if(this.options.nocache) {
			this.options.swf += "?nocache=" + BBQUtil.generateGUID();
		}

		var params = {};
		params["allowScriptAccess"] = "always";
		params["swliveconnect"] = "true";
		params["allowFullScreen"] = this.options.allowFullScreen ? "true" : "false";

		if(this.options.wmode) {
			params["wmode"] = this.options.wmode;
		}

		var flashVars = {};

		if(this.options.variables instanceof Object) {
			//Log.info("Setting flashVars on SWFObject");
			for (var key in this.options.variables) {
				flashVars[key] = this.options.variables[key];
			}
		}

		flashVars["pageObject"] = this._id;

		// swfobject demands that the element to be replaced is in the DOM :(
		var node = DOMUtil.createElement("div");
		node.id = this._id;
		document.body.appendChild(node);

		swfobject.embedSWF(this.options.swf, this._id, "100%", "100%", "10", null, flashVars, params, this.options.attributes, function(e) {
			if(e.success) {
				this.setRootNode(e.ref);
				this.getRootNode().id = this._id;
			} else {
				Log.error("Failed to embed SWF " + this.options.swf);
				Log.dir(e);
			}
		}.bind(this));
	},

	loaded: function() {
		return this._hasLoaded;
	},
	
	/**
	 * @param {Node} node
	 */
	render: function() {
		if(!Browser.Flash) {
			var errorNotification = new bbq.gui.error.NoFlash();
			errorNotification.appear();
			
			return;
		}
	},
	
	/**
	 * @private
	 */
	_loaded: function() {
		//Log.info("Getting flash object from DOM with ID " + this.options.swf.id);
		
		if(!this._hasLoaded) {
			if($(this._id)) {
				this._hasLoaded = true;
				//Log.info("notifying onLoad listeners");
				this.notifyListeners("onLoad");
			} else {
				//Log.info("DOM node not loaded yet");
				setTimeout(this._loaded.bind(this), 500);
			}
		}
	},
	
	/**
	 * @param {string} methodName
	 * @param {Object} args
	 */
	callFlashFunction: function(methodName, args) {
		//Log.info("Calling flash function " + methodName + " with args " + Object.toJSON(args));

		var rootNode = this.getRootNode();

		if(rootNode[methodName]) {
			//Log.info("Found method " + methodName + " on Flash object - " + typeof(this._flashObject[methodName]));
			if(args) {
				return rootNode[methodName](args);
			}
			
			return rootNode[methodName]();
		}
		
		Log.warn("Could not find method " + methodName + " on Flash object");
	}
});

bbq.web.SwfEmbed.instances = {};
