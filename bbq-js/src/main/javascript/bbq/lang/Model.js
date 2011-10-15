include(bbq.lang.Watchable);

/**
 * Dispatches the following notifications:
 * 
 * onLoadingStarted
 * onLoadingFinished
 * onLoadingError
 * 
 * @class bbq.lang.Model
 * @extends bbq.lang.Watchable
 */
bbq.lang.Model = Class.create(bbq.lang.Watchable, {
	options: null,
	_entities: [],
	_total: 0,
	_loading: false,
	_loaded: false,
	_error: false,
	_numToLoad: 10,
	_searchTerm: null,
	_offset: 0,
	
	initialize: function($super, options) {
		$super(options);
		
		this.options = options;
		this.load();
	},
	
	getTotal: function() {
		return this._total;
	},
	
	getOffset: function() {
		return this._offset;
	},
	
	getNumToLoad: function() {
		return this._numToLoad;
	},
	
	setOffset: function(offset) {
		this._offset = offset;
		this.load();
	},
	
	setSearchTerm: function(searchTerm) {
		this._offset = 0;
		this._loaded = false;
		this._searchTerm = searchTerm;
		this.load();
	},
	
	getEntities: function() {
		return this._entities;
	},
	
	getLoaded: function() {
		return this._loaded;
	},
	
	getLoading: function() {
		return this._loading;
	},
	
	getError: function() {
		return this._error;
	},
	
	load: function() {
		if(this._loading) {
			return;
		}
		
		this._loading = true;
		this._error = false;
		this._doLoad();
		this.notifyListeners("onLoadingStarted");
	},
	
	_doLoad: function() {
		Log.warn("Non-overridden call to Model#_doLoad");
	},
	
	_finishedLoad: function(serverResponse) {
		this._loading = false;
		this._loaded = true;
		
		this.notifyListeners("onLoadingFinished");
	},
	
	_errorLoading: function(serverResponse) {
		this._loading = false;
		this._error = true;
		
		this.notifyListeners("onLoadingError");
	}
});
