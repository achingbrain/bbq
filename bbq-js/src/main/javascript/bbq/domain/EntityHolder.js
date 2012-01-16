include(bbq.util.BBQUtil);

bbq.domain.EntityHolder = new Class.create(/** @lends bbq.domain.EntityHolder */ {
	_entities: null,
	options: null,

	/**
	 * Holds domain objects.
	 *
	 * @constructs
	 * @param {Object} options
	 * @param {Object} type The type of object - should be a child class of bbq.domain.BBQEntity
	 * @param {Array} [options.entities] Entities to pre-populate with
	 */
	initialize: function(options) {
		this.options = options ? options : {};
		this._entities = [];

		if(Object.isArray(this.options.entities)) {
			this.options.entities.each(function(entity) {
				this.add(entity);
			}.bind(this));
		}
	},

	/**
	 * @return {Number} number of elements in object array
	 */
	size: function() {
		return this._entities.length;
	},

	/**
	 * @param {Number} index
	 */
	get: function(index) {
		return this._entities[index];
	},

	/**
	 * @param * object An object or a GUID
	 * @return {Number}
	 */
	indexOf: function(object) {
		var index = -1;

		this._entities.each(function(entity, i) {
			if(entity.equals(object) || entity.getId() == object) {
				index = i;

				throw $break;
			}
		}.bind(this));

		return index;
	},

	/**
	 * @return {Array} array of elements
	 */
	getAll: function() {
		return $A(this._entities);
	},

	/**
	 * @param {Object} element
	 */
	add: function(element) {
		if(element instanceof this.options.type) {
			// passed entity
			if(this.indexOf(element) != -1) {
				return element;
			}
		} else if(Object.isString(element) || Object.isNumber(element)) {
			// passed identifier
			element = new this.options.type({data: {id: element}});
		} else {
			// passed object data
			element = new this.options.type({data: element});
		}

		return this.put(element, this._entities.length);
	},

	/**
	 * @param {Object} element
	 * @param {Number} index
	 */
	put: function(element, index) {
		if(!element instanceof this.options.type) {
			element = new this.options.type({data: element});
		}

		//Log.info(index);
		this._entities[index] = element;

		return element;
	},

	/**
	 * Removes the passed entity
	 *
	 * @param * An element of the same type contained in this list or a GUID
	 */
	remove: function(object) {
		var entityKey = BBQUtil.getKey(object, this.options.entityKey);

		for(var i = 0; i < this._objectArray.length; i++) {
			if(BBQUtil.getKey(this._objectArray[i], this.options.entityKey) == entityKey) {
				this._entities.splice(i, 1);
				//delete this._arrayIndexes["index-" + entityKey];
				i--;
			}
		}
	},

	/**
	 * removes all elements
	 */
	empty: function() {
		this._entities = [];
	}
});
