include(bbq.gui.GUIWidget);
include(bbq.util.Log);

bbq.gui.form.FormField = new Class.create(bbq.gui.GUIWidget, /** @lends bbq.gui.form.FormField.prototype */ {
	_behaviours: null,
	_preTransformValidators: null,
	_postTransformValidators: null,
	_transformer: null,

	/**
	 * Dispatches the following notifications:
	 *
	 * onError
	 *
	 * @constructs
	 * @extends bbq.gui.GUIWidget
	 * @param {Object} options
	 * @param {Object} [options.value] An initial value
	 * @param {Function} [options.onChange] A callback method invoked when the value of this field changes
	 * @param {Object} [options.valueTransformer]
	 * @param {Function} [options.valueTransformer.transform] Takes one argument and transforms it to a different value e.g. 1 to true
	 * @param {String} [options.name] The name to be set on the input field
	 */
	initialize: function($super, options) {
		try {
			$super(options);

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

	/**
	 * @inheritDoc
	 */
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
	 * Returns the value contained within this field.  The value will be
	 * validated - if the value is found to be invalid an exception
	 * will be thrown.
	 *
	 * @throws {Error} The error has two fields {String} error for language translations and {bbq.gui.form.FormField} field which is the field which caused the error.
	 * @returns {Object}
	 */
	getValue: function() {
		var value = this._getRawValue();

		return this._validateAndTransform(value);
	},

	/**
	 * Returns the name of this field.
	 *
	 * @returns {String}
	 */
	getName: function() {
		return this.options.name;
	},

	/**
	 * Returns the current value of the field without first validating it (which could
	 * cause an exception to be thrown).
	 *
	 * @returns {Object}
	 */
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

	/**
	 * Sets the value of the field
	 * @param value
	 */
	setValue: function(value) {
		this._setRawValue(value);

		this._validateAndTransform(value);
	},

	/**
	 * Adds a validator to ensure certain criteria are met.
	 *
	 * @param validator
	 * @see bbq.gui.form.validator.EmailValidator
	 * @see bbq.gui.form.validator.MustEqualFieldValidator
	 * @see bbq.gui.form.validator.NotNullValidatorValidator
	 * @see bbq.gui.form.validator.URLValidator
	 */
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

	/**
	 * Adds a behaviour modifier
	 *
	 * @param behaviour
	 * @see bbq.gui.form.behaviour.PlaceholderTextBehaviour
	 * @see bbq.gui.form.behaviour.ValidateOnBlurBehaviour
	 */
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

	/**
	 * Sets the value transformer which constrains the value of the field to certain values.
	 *
	 * @param transformer
	 * @see bbq.gui.form.transformer.BooleanValueTransformer
	 * @see bbq.gui.form.transformer.StrinkTokeniserTransformer
	 */
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

	/**
	 * Removes the CSS class denoting that this field has focus
	 */
	loseFocus: function() {
		this.removeClass("FormField_focused");
	},

	/**
	 * Adds the CSS class denoting that this field has focus
	 */
	acceptFocus: function() {
		this.addClass("FormField_focused");
	}
});
