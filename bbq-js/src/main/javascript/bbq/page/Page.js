include(bbq.BBQ);
include(bbq.util.Log);
include(bbq.web.Browser);
include(bbq.web.DOMUtil);
include(bbq.language.Language);

/**
 * @class bbq.page.Page
 */
bbq.page.Page = new Class.create({
	loadingData: false,
	dataLoaded: false,
	firstDataCall: true,
	dataCallMethod: null,
	dataCallArgs: [],
	dataCallMethodCalled: false,
	waitForDataLoadInterval: null,
	modalLayer: null,
	modalLayerContents: null,
	_fatalError: null,
	_options: null,
	
	/**
	 * Todo an example
	 * @param {mixed} args
	 * 
	 */
	initialize: function(args) {
		//Log.info("Page constructor");
		currentPage = this;
		this._options = args ? args : {};
		
		DOMUtil.checkDOM();
		
		Event.observe(window, "resize", this.resizePanels.bindAsEventListener(this));
		
		this.createLayoutManager();
	},
	
	/**
	 * Creates an object to handle adjusting the page layout when it's resized
	 * 
	 * Concrete subclasses should override this method
	 */
	createLayoutManager: function() {
		//Log.warn("Default createLayoutManager() called");
	},
	
	/**
	 * This method allows the bookmarking of pages.
	 * 
	 * When it is first invoked, it checks to see if the page's data set has been loaded.  If it has then it calls the passed function with the passed
	 * arguments.  If it has not loaded then it stores the function and arguments and sets a timeout to check the state of the data again.
	 * 
	 * N.B.  It's up to children of this class to set the dataLoaded member variable as they see fit.
	 * 
	 * @param	{Function}	methodToCall	The method to call when the data has loaded
	 * @param	{Array}	args	Arguments to pass to the methodToCall function
	 */
	checkDataLoaded: function(methodToCall, args) {
		if(!this.dataLoaded) { // initial data set has not loaded
			//Log.info("Data not loaded");
			
			if(this.firstDataCall) { // this is the first time this method has been called
				//Log.info("Storing method to call later");
				
				// store the calling method and it's arguments for later
				this.dataCallMethod = methodToCall;
				this.dataCallArgs = args;
				this.dataCallMethodCalled = false;
				
				/*  make sure we don't overwrite the data set above - this is due to an undocumented feature in 
				 *   FireFox where any set(timeout|interval) call back has an extra argument of how many msecs out
				 *   the call is.
				 */
				this.firstDataCall = false;
			}
			
			//Log.info("Setting timeout to wait for data to load");
			setTimeout(this.checkDataLoaded.bind(this), 500);
		} else if(methodToCall instanceof Function) {
			//Log.info("Data loaded, calling passed method");
			methodToCall.apply(this, args);
			
			this.firstDataCall = true;
		} else { // initial data set has loaded
			//Log.info("Data loaded, calling stored method");
			this.dataCallMethod.apply(this, this.dataCallArgs);
			this.firstDataCall = true;
		}
	},
	
	get: function(objectArray, key, expectedValue) {
		if(objectArray instanceof Array) {
			for(var i = objectArray.length-1; i >=0 ; i--) {
				var object = objectArray[i];
				
				if(object[key] == expectedValue) {
					return object;
				}
			}
		} else if(objectArray instanceof Object) {
			for(object in objectArray) {
				if(objectArray[object][key] == expectedValue) {
					return objectArray[object];
				}
			}
		} else {
			Log.warn("Invalid objectArray handed to Page.get");
		}
	},
	
	/**
	 * Bounces the user to a different page
	 */
	boot: function() {
		document.location = "/";
	},
	
	/**
	 * Redraws the areas on the page in response to a resize or other stimulus
	 */
	resizePanels: function() {
		if(typeof(LayoutManager) != "undefined" && LayoutManager.resizePanels) {
			LayoutManager.resizePanels();
		}
	},
	
	/**
	 * Default method, called when the url has no arguments after it
	 */
	showLanding: function() {
		
	},
	
	/**
	 * Should be overridden.
	 */
	renderTreeList: function() {
		
	},
	
	/**
	 * In order to avoid passing multiple copies of objects via AJAX, the list of objects is sent once and then all subsequent references to those objects are passed as 
	 * arrays of numeric IDs refering to a field of the desired object (usually called "id").
	 * 
	 * This method calls bbq.page.Page.processItem repeatedly to replace the numeric reference to the object with an actual "passed by reference" style reference.
	 * @param {mixed} items
	 * @param {string} toReplace
	 * @param {number} replaceWith
	 */
	processItems: function(items, toReplace, replaceWith) {
		if(items instanceof Array) {
			for(var i = items.length-1; i>=0; i--) {
				items[i] = this.processItem(items[i], toReplace, replaceWith);
			}
		} else {
			items = this.processItem(items, toReplace, replaceWith);
		}
		
		return items;
	},
	
	/**
	 * Links fields to objects in one parent element
	 * @param {Object} item
	 * @param {string} toReplace
	 * @param {number} replaceWith
	 */
	processItem: function(item, toReplace, replaceWith) {
		for(var n = toReplace.length-1; n >=0 ; n--) {
			if(!(item[toReplace[n]] instanceof Array)) {
				item[toReplace[n]] = this[replaceWith[n]].getElement(item[toReplace[n]]);
				continue;
			}
			
			for(var k = 0; k < item[toReplace[n]].length; k++) {
				var entity = this[replaceWith[n]].getElement(item[toReplace[n]][k]);
			
				if(entity) {
					item[toReplace[n]][k] = entity;
				}
			}
		}
		
		return item;
	},
	
	/**
	 * Greys out the page and shows the passed element in the middle.  The passed element should
	 * extend bbq.gui.GUIWidget
	 * 
	 * @param	{bbq.gui.GUIWidget}	guiWidget
	 */
	addModalLayer: function(guiWidget) {
		try {
			if(!this.modalLayer) {
				this.modalLayer = DOMUtil.createElement("div", {className: "modalLayer", style: {display: "none"}});
				document.body.appendChild(this.modalLayer);
			}
			
			this.modalLayerContents = guiWidget;
			this.modalLayerContents.setStyle("display", "none");
			this.modalLayerContents.appendTo(document.body);
			
			if(Browser.Mozilla && Browser.version < 3) { // stop scroll bars from showing through modal layer
				$$(".ScrollableHolder").each(function(element){
					element.style.overflow = "hidden";
				});
				
				$$(".FloatingWindow .ScrollableHolder").each(function(element){
					element.style.overflow = "auto";
				});
			}
			
			Effect.Appear(this.modalLayer, {
				duration: 0.25,
				to: 0.8
			});
			
			Effect.Appear(this.modalLayerContents.getRootNode(), {
				duration: 0.25,
				to: 1
			});
			
			if(this.modalLayerContents.appear && this.modalLayerContents.disappear) {
				// bbq.gui.FloatingWindow
				this.modalLayerContents.appear();
				this.modalLayerContents.registerOneTimeListener("onDisppear", this.clearModalLayer.bind(this));
			}
			
			return guiWidget;
		} catch(e) {
			Log.error("Error adding modal layer", e);
		}
	},
	
	/**
	 * Fades out the layers added by com.proxim.page.Page.addModalLayer
	 */
	clearModalLayer: function() {
		if(this._fatalError) {
			return;
		}
		
		if(this.modalLayer) {
			Effect.Fade(this.modalLayer, {
				duration: 0.25
			});
		}
		
		if(this.modalLayerContents) {
			Effect.Fade(this.modalLayerContents.getRootNode(), {
				duration: 0.25
			});
		}
		
		if(Browser.Mozilla && Browser.version < 3) {// re-enable scroll bars
			$$(".ScrollableHolder").each(function(element){
				element.style.overflow = "auto";
			});
		}
		
		setTimeout(this._removeModalLayer.bind(this), 600);
	},
	
	/**
	 * Removes the layers added by com.proxim.page.Page.addModalLayer from the document tree
	 */
	_removeModalLayer: function() {
		if(this._fatalError) {
			return;
		}
		
		if(!this.modalLayer || this.modalLayer.parentNode != document.body) {
			return;
		}
		
		if(!this.modalLayerContents || !this.modalLayerContents.rootNode || this.modalLayerContents.rootNode.parentNode != document.body) {
			return;
		}
		
		try {
			document.body.removeChild(this.modalLayer);
			document.body.removeChild(this.modalLayerContents.rootNode);
		} catch(e) {
			Log.warn("Exception thrown while removing modal layer - " + e);
		}
		
		this.modalLayer = null;
		this.modalLayerContents = null;
	}
});
