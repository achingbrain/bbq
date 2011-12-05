include(bbq.gui.GUIWidget);
include(bbq.util.Log);

/**
 * Supports the following options:
 *
 * options: {
 *      value:  Object      // an initial value
 * }
 *
 * Dispatches the following notifications:
 *
 * onError
 */
bbq.gui.form.FormField = new Class.create(bbq.gui.GUIWidget, {
	_behaviours: null,
	_preTransformValidators: null,
	_postTransformValidators: null,
	_transformer: null,

	initialize: function($super, args) {
		try {
			$super(args);

			this._behaviours = [];
			this._preTransformValidators = [];
			this._postTransformValidators = [];

			this.setRootNode("input");
			this.addClass("FormField");

			if(this.options.onChange) {
				this.registerListener("onChange", this.options.onChange);
			}

			if(this.options.valueTransformer) {
				this.setValueTransformer(this.options.valueTransformer);
			}

			if(this.options.name) {
				this.setAttribute("name", this.options.name);
			}

			this.registerListener("onFocus", function() {
				FocusWatcher.setKeypressCallbackObject(this);
			}.bind(this));

			this.registerListener("onBlur", function() {
				FocusWatcher.setKeypressCallbackObject(null);
			}.bind(this));
		} catch(e) {
			Log.error("Error constructing FormField", e);
		}
	},

	setRootNode: function($super, rootNode) {
		$super(rootNode);

		this.getRootNode().onfocus = this.notifyListeners.bind(this, "onFocus");
		this.getRootNode().onblur = this.notifyListeners.bind(this, "onBlur");
		this.getRootNode().onchange = this.notifyListeners.bind(this, "onChange");

		if(!Object.isUndefined(this.options.value)) {
			this._setRawValue(this.options.value);
		}
	},

	_getRawValue: function() {
		return this.getRootNode().value;
	},

	_setRawValue: function(value) {
		if(this._transformer && this._transformer.deTransform) {
			value = this._transformer.deTransform(value);
		}

		this.getRootNode().value = value;
	},

	/**
	 * Returns the value contained within this field.
	 */
	getValue: function() {
		var value = this._getRawValue();

		return this._validateAndTransform(value);
	},

	getName: function() {
		return this.options.name;
	},

	getUnvalidatedValue: function() {
		var value = this._getRawValue();

		return this._transform(value);
	},

	_validateAndTransform: function(value) {
		this.removeClass("FormField_error");

		// run pre-transform validators
		this._preValidate(value);

		// transform the value if necessary
		value = this._transform(value);

		// run post transform validators
		this._postValidate(value);

		// return our value
		return value;
	},

	_transform: function(value) {
		// if we have a value transformer, transform the value
		if (this._transformer) {
			value = this._transformer.transform(value);
		}

		return value;
	},

	_preValidate: function(value) {
		this._preTransformValidators.each(function(validator) {
			var result = validator.validate(value);

			if (result) {
				var error = {error: result, field: this};

				this.addClass("FormField_error");
				this.notifyListeners("onError", error);

				throw error;
			}
		}.bind(this));
	},

	_postValidate: function(value) {
		this._postTransformValidators.each(function(validator) {
			var result = validator.validate(value);

			if (result) {
				var error = {error: result, field: this};

				this.addClass("FormField_error");
				this.notifyListeners("onError", error);

				throw error;
			}
		}.bind(this));
	},

	setValue: function(value) {
		this._setRawValue(value);

		this._validateAndTransform(value);
	},

	addValidator: function(validator) {
		if(!validator) {
			Log.error("Invalid validator!");

			return;
		}

		if(!validator.validate) {
			Log.error("Validator should implement a validate method");

			return;
		}

		if (validator.isPostTransformValidator && validator.isPostTransformValidator()) {
			this._postTransformValidators.push(validator);
		} else {
			this._preTransformValidators.push(validator);
		}
	},

	addBehaviour: function(behaviour) {
		if (!behaviour) {
			Log.error("Invalid behaviour!");
		}

		if (!behaviour.setField) {
			Log.error("Behaviour should implement a setField method");

			return;
		}

		behaviour.setField(this);

		this._behaviours.push(behaviour);
	},

	setValueTransformer: function(transformer) {
		if (!transformer) {
			Log.error("Invalid transformer!");
		}

		if (!transformer.transform) {
			Log.error("Transformer should implement a transform method");

			return;
		}
		
		this._transformer = transformer;
	},

	loseFocus: function() {
		this.removeClass("FormField_focused");
	},

	acceptFocus: function() {
		this.addClass("FormField_focused");
	}
});
