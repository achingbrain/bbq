include(bbq.util.BBQUtil);

/**
 * @class bbq.lang.DataHolder
 */
bbq.lang.DataHolder = new Class.create({
	
	_objectArray: null,
	_arrayIndexes: null,
	options: null,
	
	/**
	 * @param {Object} options
	 * 
	 * Supports the following options:
	 * 
	 * options: {
	 * 		entities: Array		Entities to pre-populate with
	 * 		entityKey: String	Name of property or method that should be accessed to return a unique ID for each entity
	 * }
	 */
	initialize: function(options) {
		this.options = options ? options : {};
		this._objectArray = [];
		this._arrayIndexes = {};
		
		if(this.options.entities && this.options.entities instanceof Array) {
			this.options.entities.each(function(entity) {
				this.addElement(entity);
			}.bind(this));
		}
	},
	
	/**
	 * @return {integer} number of elements in object array
	 */
	getLength: function() {
		return this._objectArray.length;
	},
	
	setLength: function(num) {
		this._objectArray.length = num;
		this._syncArray();
	},
	
	/**
	 * @param {mixed} by	An array index or a GUID
	 */
	getElement: function(by) {
		if(BBQUtil.isGUID(by)) {
			by = this.indexOf(by);
		}
		
		return this._objectArray[by];
	},
	
	/**
	 * @param {mixed} object	An object or a GUID
	 * @return {integer}
	 */
	indexOf: function(object) {
		if(!BBQUtil.isGUID(object)) {
			object = BBQUtil.getKey(object, this.options.entityKey);
		}
		
		return this._arrayIndexes["index-" + object];
	},
	
	_put: function(object, index) {
		this._arrayIndexes["index-" + BBQUtil.getKey(object, this.options.entityKey)] = index;
	},
	
	/**
	 * Places the passed object at the specified index
	 * 
	 * @param {integer} index
	 * @param {Object} object
	 */
	setElement: function(index, object) {
		this._objectArray[index] = object;
		
		// try to store item
		if(BBQUtil.getKey(object, this.options.entityKey)) {
			this._put(object, index);
		}
		
		return object;
	},
	
	/**
	 * @return {Array} array of elements
	 */
	getElements: function() {
		return this._objectArray;
	},
	
	/**
	 * @param {Object} element
	 */
	addElement: function(element) {
		return this.addElementAtIndex(element, this._objectArray.length);
	},
	
	/**
	 * @param {Object} element
	 * @param {integer} index
	 */
	addElementAtIndex: function(element, index) {
		//Log.info(index);
		this._objectArray[index] = element;
		this._put(element, index);
		
		return element;
	},
	
	/**
	 * Removes the passed entity
	 * 
	 * @param {mixed} An element of the same type contained in this list or a GUID
	 */
	remove: function(object) {
		var entityKey = BBQUtil.getKey(object, this.options.entityKey);
		
		for(var i = 0; i < this._objectArray.length; i++) {
			if(BBQUtil.getKey(this._objectArray[i], this.options.entityKey) == entityKey) {
				this._objectArray.splice(i, 1);
				//delete this._arrayIndexes["index-" + entityKey];
				i--;
			}
		}
		
		this._syncArray();
	},
	
	/**
	 * removes all elements
	 */
	clear: function() {
		this._objectArray.splice(0, this._objectArray.length);
		this._arrayIndexes = {};
	},
	
	/**
	 * Updates the internal shortcut array
	 */
	_syncArray: function() {
		this._arrayIndexes = {};
		
		for(var i=this._objectArray.length-1; i>=0; i--) {
			this._put(this._objectArray[i], i);
		}
	}
});
