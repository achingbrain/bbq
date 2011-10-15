include(bbq.gui.GUIWidget);
include(bbq.ajax.JSONRequest);
include(bbq.lang.DataHolder);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.ScrollLoadGUIWidget
 * @extends bbq.gui.GUIWidget 
 */
bbq.gui.ScrollLoadGUIWidget = new Class.create(bbq.gui.GUIWidget, {
	
	_scrollableHolder: null,
	_lastRange: null,
	_scrollingTimeout: null,
	_numEntities: null,
	_initialLoad: null,
	_loading: null,
	_entities: null,
	_callbacks: null,
	
	/**
	 * @param {mixed} options
	 * @example
	 * The URL passed as part of the options object should return in the following format:
	 * 
	 *  { numEntities: int, entities: {"en7": data, "en8": data, "en9": data,...}}     // <-  enN is zero indexed!
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		rowHeight: int								// roughly the expected height of one row.
	 * 		createEntity: function(data)		// should return one new entity
	 * 		url: String										// where to load from
	 * 		args: Object									// arguments to pass
	 * 		numToLoad: int							// how many entities to load initially and on every column sort
	 * 		loadingText: String						// shown while doin the inital load
	 * 		noEntitiesText:	String					// shown when there is nothing to show
	 * 		entityKey: String							// the key field on each entity.  Pass this OR getEntityKey
	 * 		getEntityKey: Function					// should take an entity and return it's id Pass this OR entityKey
	 * }
	 * 
	 * Supports observers for the following events
	 * 
	 * onEntitiesLoad
	 * onEmptyList
	 * onEntitiesLoaded
	 * onSelectedEntityChange
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("ScrollLoadGUIWidget");
		this._lastRange = {start: 0, end: 0};
		
		if(typeof(this.options.args) == "undefined") {
			this.options.args = {};
		}
		
		if(typeof(this.options.startSorted) != "undefined") {
			this.options.args.sortBy = parseInt(this.options.startSorted.column);
			this.options.args.sortDirection = this.options.startSorted.direction == bbq.constants.PAGINATOROPTIONS_SORTDESC ? bbq.constants.PAGINATOROPTIONS_SORTDESC : bbq.constants.PAGINATOROPTIONS_SORTASC;
			this.options.args.includeArchived = false;
		} else {
			this.options.args.sortBy = 0;
			this.options.args.sortDirection = bbq.constants.PAGINATOROPTIONS_SORTDESC;
			this.options.args.includeArchived = false;
		}
		
		this._entities = new bbq.lang.DataHolder({entityKey: this.options.entityKey});
		this._loading = false;
		this._initialLoad = true;
		
		this._callbacks = {};
	},
	
	_getEntityKey: function(entity) {
		if(this.options.getEntityKey) {
			return this.options.getEntityKey(entity);
		}
		
		return BBQUtil.getKey(entity, this.options.entityKey);
	},
	
	_storeCallback: function(entity, action, callback) {
		if(!(callback instanceof Function)) {
			return;
		}
		
		var key = this._getEntityKey(entity);
		
		if(typeof(this._callbacks[key]) == "undefined") {
			this._callbacks[key] = {};
		}
		
		this._callbacks[key][action] = callback;
	},
	
	_processEvent: function(event, entity) {
		BBQUtil.clearFocus(event);
		this._invokeCallback(entity, event.type);
		
		if(FocusWatcher) {
			FocusWatcher.setKeypressCallbackObject(this);
		}
		
		return false;
	},
	
	_invokeCallback: function(entity, action) {
		try {
			var key = this._getEntityKey(entity);
			
			if(this._callbacks[key] && this._callbacks[key][action] instanceof Function) {
				// only set the item down if the callback does not return false
				var result = this._callbacks[key][action](entity);
				
				if(result !== false) {
					this.setDown(entity);
				}
				
				return result;
			}
		} catch(e) {
			Log.error("Error invoking callback " + action, e);
		}
	},
	
	setDown: function(entity) {
		this.notifyListeners("onSelectedEntityChange");
	},
	
	/**
	 * Set the scrollable that holds this widget.  This is necessary so we can watch it to find out when we should try to reload the 
	 * data contained within ourselves.
	 */
	setScrollableHolder: function(scrollableHolder) {
		this._scrollableHolder = scrollableHolder;
		this._scrollableHolder.registerListener("onScroll", function() {
			this._scrollableScrolled();
		}.bind(this));
		this._scrollableHolder.registerListener("onResize", function() {
			this._scrollableScrolled();
		}.bind(this));
	},
	
	/**
	 * Returns the scrollable holder that contains this widget
	 */
	getScrollableHolder: function() {
		return this._scrollableHolder;
	},
	
	/**
	 * @protected
	 * 
	 * Callback for when the containing scrollable is scrolled.
	 */
	_scrollableScrolled: function() {
		if(this._scrollingTimeout) {
			clearTimeout(this._scrollingTimeout);
		}
		
		this._scrollingTimeout = setTimeout(this._workOutMovement.bind(this), 500);
	},
	
	/**
	 * @protected
	 * 
	 * Override this method in your subclass.  It should work out which elements (loaded or not) 
	 * are currently visible and call:
	 * 
	 * this._loadDetails(startElement, endElement);
	 * 
	 * Where the arguments to _loadDetails are their indexes in the _entities array
	 */
	_workOutMovement: function() {	
		Log.error("Non overriden call to ScrollLoadGUIWidget._workOutMovement");
	},
	
	_loadDetails: function(start, end) {
		try {
			if(this._scrollingTimeout) {
				clearTimeout(this._scrollingTimeout);
			}
			
			//Log.info("passed " + start + " to " + end);
			if(typeof(start) == "undefined" || start  < 0) {
				start = 0;
			}
			
			if(start > end) {
				start = end - 1;
			}
			
			var needLoad = false;
			
			if(this._initialLoad) {
				needLoad = true;
			} else {
				//Log.info("checking " + start + " to " + end + " of " + this._entities.length);
				
				// see which entities we need to load data for
				for(var i = start; i <= end; i++) {
					if(!this._entities.getElement(i)) {
						//Log.info("item " + i + " triggered load");
						needLoad = true;
						break;
					}
				}
			}
			
			if(!this._loading && needLoad) {
				this.options.args["entityOffset"] = start;
				this.options.args["entityLength"] = end - start;
				
				new bbq.ajax.JSONRequest({
					url: this.options.url, 
					args: this.options.args,
					onSuccess: this._loadedDetails.bind(this), 
					method: "post"
				});
				
				this._loading = true;
				
				this.notifyListeners("onEntitiesLoad");
			} else {
				this.notifyListeners("onAllEntitiesLoadedAlready");
			}
		} catch(e) {
			Log.error("Error loading details", e);
		}
	},
	
	dataLoaded: function() {
		if(this._initialLoad) {
			return false;
		}
		
		return !this._loading;
	},
	
	_loadedDetails: function(serverResponse, json) {
		try {
			this._loading = false;
			this._initialLoad = false;
			var numEntities = json.numEntities;
			if(!(json.entities instanceof Array)) {
				if(this._entities.getLength() != numEntities) {
					if(numEntities > this._entities.getLength()) {
						// pad the array
						for(var i = numEntities-1; i >= 0; i--) {
							if(typeof(this._entities.getElement(i)) == "undefined") {
								this._entities.setElement(i, false);
							}
						}
					} else {
						// truncate list
						this._entities.setLength(numEntities);
					}
				}
				
				this._processNewEntities(json);
			}
			
			this.render();
			
			this.notifyListeners("onEntitiesLoaded");
			
			if(this._entities.getLength() == 0) {
				this.notifyListeners("onEmptyList");
			}
		} catch(e) {
			Log.error("thrown _loadedDetails", e);
		}
	},
	
	_processNewEntities: function(json) {
		var entities = json.entities;
		for(var key in entities) {
			var index = parseInt(key.replace("en", ""));
					
			if(this.options.createEntity) {
				this._entities.setElement(index, this.options.createEntity(entities[key], index));
			} else {
				this._entities.setElement(index, entities[key]);
			}
		}
	},
	
	appendTo: function(pageNode) {
		bbq.gui.GUIWidget.prototype.appendTo.apply(this, arguments);
		clearTimeout(this._scrollingTimeout);
		this._scrollingTimeout = setTimeout(this._workOutMovement.bind(this), 1000);
	},
	
	/**
	 * Loads the entities currently visible in the viewport if they have not been loaded already
	 */
	loadEntities: function() {
		clearTimeout(this._scrollingTimeout);
		this._workOutMovement();
	},
	
	/**
	 * Empties the list of currently loaded entities and reloads the entities currently visible in the viewport.
	 * 
	 * Use this method if the order of items has been changed.
	 */
	reloadEntities: function() {
		this._entities.clear();
		this._initialLoad = true;
		this.render();
		this._workOutMovement();
	},
	
	getFirstEntity: function() {
		return this._entities.getElement(0);
	},
	
	getNumEntities: function() {
		return this._entities.getLength();
	},
	
	/**
	 * Sorts the entity set by the given index and direction.
	 * 
	 * @param {int} index
	 * @param {int} direction
	 */
	sortByIndex: function(index, direction) {
		direction = 0 + direction;
		this.options.args.sortBy = parseInt(index);
		this.options.args.sortDirection = parseInt(direction) == bbq.constants.PAGINATOROPTIONS_SORTASC ? bbq.constants.PAGINATOROPTIONS_SORTASC : bbq.constants.PAGINATOROPTIONS_SORTDESC;
		this.reloadEntities();
		return false;
	},
	
	setSearchTerm: function(newTerm) {
		this.options.args.searchTerm = newTerm;
	}
});
