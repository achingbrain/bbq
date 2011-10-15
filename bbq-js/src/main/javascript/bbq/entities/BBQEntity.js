include(bbq.lang.Watchable);
include(bbq.util.BBQUtil);

/**
 * @class bbq.entities.BBQEntity
 * @extends bbq.lang.Watchable
 */
bbq.entities.BBQEntity = new Class.create(bbq.lang.Watchable, {
		
	id: null,
	options: null,
	_data: null,
	_dataLoaded: null,
	_partialLoad: null,
	_loadedFields: null,
	_retrieveURL: null,
	_propertyDisplays: null,
	_propertyDisplayCleanupInterval: null,
	_loadingData: null,
	
	/**
	 * Constructor
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.options = options ? options : {};
		this._data = {};
		this._propertyDisplays = new Hash();
		this._loadedFields = new Hash();
		
		this.processData(this.options.data);
	},
	
	/**
	 * Should return an object similar to the data structure of this class.
	 * 
	 * The object should contain properties that mirror the output of getArray() in the PHP on the server.
	 * @private
	 * @return {Object}
	 */
	_getDefaultObject: function() {
		return {
			id: false
		}
	},
	
	/**
	 * Sets properties on this object and creates getters/setters for accessing them
	 * 
	 * Also used by child classes to replace IDs with references to the actual objects
	 * 
	 * @param	{Object}	data
	 * @return	void
	 */
	processData: function(data) {
		if(data && data instanceof Object) {
			this.id = data.id;
			
			var defaultObject = this._getDefaultObject();
			
			for(var key in data) {
				// skip fields not defined on this object - this way we do not end up with erroneous getters and setters
				if(typeof(defaultObject[key]) == "undefined") {
					Log.warn("skipping " + key + " on object loading data from " + this._retrieveURL);
					continue;
				}
				
				var camel = BBQUtil.capitalize(key);
				
				if(this["set" + camel] instanceof Function) {
					this["set" + camel](data[key]);
				} else {
					//Log.info("creating " + camel);
					this["get" + camel] = (new Function("return this._get(\"" + key + "\");")).bind(this);
					this["set" + camel] = (new Function("this._set(\"" + key + "\", arguments[0]);")).bind(this);
				
					this["set" + camel](data[key]);
				}
				
				this._loadedFields.set(key, true);
			}
			
			this._partialLoad = false;
			
			// start delete me later
			var missingProperties = [];
			
			// ensure we have loaded all of our properties
			for(var key in defaultObject) {
				if(typeof(data[key]) == "undefined") {
					missingProperties.push(key);
				}
			}
			
			if(missingProperties.length > 0) {
				Log.warn(this._retrieveURL + " missing properties " + missingProperties.join(", "));
			}
			// end delete me later
			
			// ensure we have loaded all of our properties
			for(var key in defaultObject) {
				if(Object.isUndefined(data[key])) {
					this._dataLoaded = false;
					this._partialLoad = true;
					
					// missing at least one property, get out of loop
					break;
				}
			}
			
			var keys = Object.keys(data);
			
			if(keys.length == 1 &&  keys[0] == "id") {
				this.loadData();
			} else if(!this._partialLoad) {			
				this._dataLoaded = true;
			}
		}
	},
	
	dataLoaded: function() {
		return this._dataLoaded === true;
	},
	
	/**
	 * Makes an entity load it's data.
	 * 
	 * Register for listener "onDataLoaded" to interact with this object after data has been loaded.
	 * 
	 * @return void
	 */
	loadData: function() {
		if(this._loadingData) {
			return;
		}
		
		this._loadingData = true;
		
		if(!this._retrieveURL) {
			Log.error("Objects must specify where to load data from", this);
			
			return;
		}
		
		this._dataLoaded = false;
		this._partialLoad = false;
	
		new bbq.ajax.JSONRequest({
			url: this._retrieveURL, 
			args: {id: this.getId()}, 
			onSuccess: this._loadedData.bind(this), 
			method: "post"
		});
	},
	
	/**
	 * @return void
	 */
	_loadedData: function(serverResponse, json) {
		try {
			this._loadingData = false;
			
			this.processData(json);
			
			if(this.dataLoaded()) {
				this.notifyListeners("onDataLoaded");
			}
		} catch(e) {
			Log.error("Error encountered while processing data", e);
		}
	},
	
	/**
	 * {@inheritDoc}
	 */
	registerListener: function(type, callback) {
		var callbackKey = bbq.lang.Watchable.prototype.registerListener.apply(this, arguments);
		
		if(type == "onDataLoaded") {
			if(this.dataLoaded()) {
				// if the callback is onDataLoaded and we've already loaded our data, call the callback immediately
				this.notifyListener(type, callbackKey, [this]);
			} else {
				// otherwise trigger data load
				this.loadData();
			}
		}
		
		return callbackKey;
	},
	
	/**
	 * @private
	 * @param	{String}	key
	 * @return	{mixed}
	 */
	_get: function(key) {
		//Log.info("returning " + this._data[key] + " for key " + key);
		return typeof(this._data[key]) != "undefined" ? this._data[key] : null;
	},
	
	/**
	 * @private
	 * @param	{String}	key
	 * @param	{mixed}	value
	 */
	_set: function(key, value) {
		this._data[key] = value;
		
		// update property displays for this property
		// set a timeout so that all the properties on this object have been updated by the time the first propertyDisplay update occurs
		setTimeout(this._updatePropertyDisplays.bind(this, key), 500);
		
		return this._data[key];
	},
	
	/**
	 * Returns the unique identifier of this object, a GUID
	 * 
	 * @return	{String} 
	 */
	getID: function() {
		return this.id;
	},
	
	equals: function(entity) {
		if(BBQUtil.isGUID(entity)) {
			return this.getId() == entity;
		}
		
		return entity && entity.getId && this.getID() == entity.getId();
	},
	
	/**
	 * @param	String		property		A property on this object
	 */
	getProperty: function(property) {
		try {
			if(property.indexOf(".") != -1) {
				property = "" + property.split(".", 1);
			}
			
			if(this["get" + BBQUtil.capitalize(property)] instanceof Function) {
				return this["get" + BBQUtil.capitalize(property)]();
			}
		} catch(e) {
			Log.error("getProperty threw a wobbly on " + property + " " + this._createURL, e);
			Log.error("this.get" + BBQUtil.capitalize(property) + " = " + this["get" + BBQUtil.capitalize(property)]);
			Log.dir(this);
		}
	},
	
	/**
	 * Returns a DOM element (by default a SPAN) that contains a textual representation of the requested property of this element.
	 * 
	 * Will be updated automatically to contain the current value.
	 * 
	 * Supports getting properties of sub objects.  For example, if we want the name of this objects's creator, we can do:
	 * 
	 * <code>
	 * object.getPropertyDisplay({property: "creator.fullname"});
	 * </code>
	 * 
	 * This will have the same effect as:
	 * 
	 * <code>
	 * var creator = object.getCreator();
	 * creator.getPropertyDisplay({property: "fullname"});
	 * </code>
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		property: String			// The name of the property that is to be displayed
	 * 		formatter: Function		// Optional.  A function that takes the property value as an argument and returns a String or a Node
	 * 		nodeName: String			// Optional.  Will be used in place of SPAN
	 * 		className: String			// Optional.  Will be applied to the node
	 * 		createNode: Function	// Optional.  Should return a DOM node.  Omit this to use a SPAN.  If passed you should also pass a function for updateNode
	 * 		updateNode: Function // Optional.  Expect two arguments - a node and the property value.  Return nothing.  If passed you should also pass a function for createNode
	 * }
	 * 
	 * @param	Object			options
	 */
	getPropertyDisplay: function(options) {
		try {
			if(options.property.indexOf(".") != -1) {
				// pass request on to child object
				var parts = options.property.split(".");
				var myProperty = parts.shift();
				
				var object = this.getProperty(myProperty)
				
				options.property = parts.join(".");
				
				if(object) {
					// object is valid, pass the request on
					return object.getPropertyDisplay(options);
				} else {
					// an attempt to call a function on a child object that has not been set.  return a placeholder
					var node = options.createNode instanceof Function ? options.createNode() : DOMUtil.createElement("span");
					
					if(options.formatter) {
						var value = options.formatter(null);
						
						if(value) {
							DOMUtil.append(value, node);
						}
					}
					
					return node;
				}
			}
			
			var propertyDisplay = {
				node: options.createNode instanceof Function ? options.createNode() : DOMUtil.createElement(options.nodeName ? options.nodeName : "span", {className: options.className ? options.className : ""}),
				formatter: options.formatter,
				property: options.property,
				updateNode: options.updateNode
			};
			
			if(this["get" + BBQUtil.capitalize(options.property)] instanceof Function) {
				// we've loaded our data already, update current property displays
				this._updatePropertyDisplay(propertyDisplay);
			} else {
				// ensure that this property display will be updated
				this.registerOneTimeListener("onDataLoaded", function() {
					this._updatePropertyDisplay(propertyDisplay);
				}.bind(this));
				
				// if this object is partially loaded and requested property has not been loaded yet, trigger loading of this objects data
				if(this._partialLoad && !this._loadedFields.get(options.property)) {
					Log.info("Partially loaded object triggering loadData");
					this.loadData();
				}
			}
			
			// create array for the requested property
			if(!this._propertyDisplays.get(options.property)) {
				this._propertyDisplays.set(options.property, []);
			}
			
			// add it to our list of property diplays
			this._propertyDisplays.get(options.property).push(propertyDisplay);
			
			// clean up previously created property displays that are no longer in the DOM
			this._cleanUpPropertyDisplays();
			
			// return the node for addition to the DOM
			return propertyDisplay.node;
		} catch(e) {
			Log.error("Exception thrown while trying to retrieve property display " + this._createURL, e);
			Log.dir(options);
		}
	},
	
	/**
	 * Loops through all existing property displays and updates them.
	 * 
	 * @private
	 */
	_updatePropertyDisplays: function(property) {
		if(this._propertyDisplays.get(property)) {
			this._propertyDisplays.get(property).each(function(displayProperty) {
				this._updatePropertyDisplay(displayProperty);
			}.bind(this));
		}
	},
	
	/**
	 * Updates stored property displays to contain the current value as known by this object
	 * 
	 * @private
	 */
	_updatePropertyDisplay: function(propertyDisplay) {
		DOMUtil.emptyNode(propertyDisplay.node);
		
		var value = this.getProperty(propertyDisplay.property);
		
		if(propertyDisplay.formatter instanceof Function) {
			value = propertyDisplay.formatter(value);
		}
		
		if(propertyDisplay.updateNode instanceof Function) {
			propertyDisplay.updateNode(propertyDisplay.node, value);
		} else {
			if(!value) {
				value = " ";
			}
			
			// default action is to treat node as if it is a SPAN
			if(Object.isString(value)) {
				var theText = value.split("\n");
				
				for(var i = 0; i < theText.length; i++) {
					propertyDisplay.node.appendChild(document.createTextNode(theText[i]));
					
					if(theText.length > 1 && i != (theText.length - 1)) {
						propertyDisplay.node.appendChild(document.createElement("br"));
					}
				}
			} else {
				DOMUtil.append(value, propertyDisplay.node);
			}
		}
	},
	
	/**
	 * Loops through all stored property displays, removing any references to nodes that have been removed from the DOM
	 * 
	 * @private
	 */
	_cleanUpPropertyDisplays: function() {
		if(this._propertyDisplayCleanupInterval) {
			clearInterval(this._propertyDisplayCleanupInterval);
		}
		
		// set an interval to allow whatever rendering action that is currently underway to complete
		// use interval instead of timeout so that we only do this once
		this._propertyDisplayCleanupInterval = setInterval(function() {
			this._propertyDisplays.keys().each(function(key) {
				for(var i = 0; i < this._propertyDisplays.get(key).length; i++) {
					if(!DOMUtil.isInDOM(this._propertyDisplays.get(key)[i].node)) {
						// element has been removed from DOM, delete our reference
						this._propertyDisplays.get(key).splice(i, 1);
						i--;
					}
				}
			}.bind(this));
			
			clearInterval(this._propertyDisplayCleanupInterval);
		}.bind(this), 1000);
	}
});

