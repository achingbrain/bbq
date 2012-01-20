include(bbq.util.BBQUtil);

bbq.domain.Repository = new Class.create(/** @lends bbq.domain.Repository.prototype */ {
	_entities: null,
	options: null,

	/**
	 * Holds domain objects.
	 *
	 * @constructs
	 * @param {Object} options
	 * @param {Object} type The type of object - should be a child class of bbq.domain.Entity
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
	 * @param {Object} entity An object or a id
	 * @return {Number}
	 */
	indexOf: function(entity) {
		entity = this._createEntity(entity);

		for(var i = 0; i < this._entities.length; i++) {
			if(this._entities[i].equals(entity)) {
				return i;
			}
		}

		return -1;
	},

	/**
	 * @return {Array} All entities contained in this Repository
	 */
	getAll: function() {
		return $A(this._entities);
	},

	/**
	 * Adds an Entity to this repository.  Pass either an identifier, object data or a domain object.
	 *
	 * @param {Object} entity
	 * @returns {Object} The domain object
	 */
	add: function(entity) {
		entity = this._createEntity(entity);

		if(this.indexOf(entity) == -1) {
			this.put(entity, this._entities.length);
		}

		return entity;
	},

	/**
	 * @param {Object} entity
	 * @param {Number} index
	 */
	put: function(entity, index) {
		entity = this._createEntity(entity);

		this._entities[index] = entity;

		return entity;
	},

	/**
	 * Removes the passed entity
	 *
	 * @param {Object} An entity of the same type contained in this list, data object or an id
	 */
	remove: function(entity) {
		var index = this.indexOf(entity);

		if(index == -1) {
			return;
		}

		this._entities.splice(index, 1);
	},

	_createEntity: function(data) {
		if(data instanceof this.options.type) {
			// passed domain object
		} else if(Object.isString(data) || Object.isNumber(data)) {
			// passed identifier
			data = new this.options.type({data: {id: data}});
		} else {
			// passed object data
			data = new this.options.type({data: data});
		}

		// make sure domain object does not exist in this repository already
		for(var i = 0; i < this._entities.length; i++) {
			if(this._entities[i].equals(data)) {
				// object has been stored before
				data = this.get(i);
				data.processData(data.options.data);

				break;
			}
		}

		return data;
	},

	/**
	 * removes all elements
	 */
	empty: function() {
		this._entities = [];
	}
});
