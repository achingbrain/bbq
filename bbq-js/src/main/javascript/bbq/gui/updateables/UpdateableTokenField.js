include(bbq.gui.updateables.UpdateableTextField);
include(bbq.gui.token.TextToken);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.updateables.UpdateableTokenField
 * @extends bbq.gui.updateables.UpdateableTextField 
 */
bbq.gui.updateables.UpdateableTokenField = new Class.create(bbq.gui.updateables.UpdateableTextField, {
	_noItemsText: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Todo an example here
	 * 
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.addClass("UpdateableTokenField");
	},
	
	_setInitialValues: function() {
		if(!Object.isUndefined(this.options.propertyDisplay)) {
			this._setCurrentValue(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key));
		} else {
			var value = [];
			
			if(this.options.initialValue instanceof Array) {
				this.options.initialValue.each(function(keyword) {
					value.push(keyword);
				}.bind(this));
			}
			
			this._setCurrentValue(value);
		}
		
		this._setOriginalValue(BBQUtil.cloneObject(this._getCurrentValue()));
	},
	
	/**
	 * Called after the object the property display belongs to has loaded it's values
	 */
	_updateInitialValues: function() {
		this._setCurrentValue(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key));
		this._setOriginalValue(this.options.propertyDisplay.entity.getProperty(this.options.propertyDisplay.key));
	},
	
	_createViewFieldFromPropertyDisplay: function() {
		return this.options.propertyDisplay.entity.getPropertyDisplay({property: this.options.propertyDisplay.key, formatter: function(words) {
			return this.createViewField();
		}.bind(this)});
	},
	
	createEditField: function() {
		this.inputField = bbq.gui.updateables.UpdateableTextField.prototype.createEditField.apply(this);
		this.inputField.value = this._getCurrentValue().join(", ").strip();
		
		return this.inputField;
	},
	
	createViewField: function() {
		if(!this._getCurrentValue() || this._getCurrentValue().length == 0) {
			return this._noItemsText;
		}
		
		var documentFragment = document.createDocumentFragment();
		
		this._getCurrentValue().each(function(word) {
			var textToken = new bbq.gui.token.TextToken({text: word});
			textToken.appendTo(documentFragment);
		});
		
		return documentFragment;
	},
	
	_validateInput: function(input, currentValues) {
		Log.error("UpdateableTokenField#_validateInput not overridden");
	},
	
	updateLocalValue: function() {
		if(this.options.inlineInstruction && this.inputField.value == this.options.inlineInstruction) {
			// no value has been entered
			this._setCurrentValue([]);
		} else {
			// create array from entered words
			var words = []; 
			
			this.inputField.value.split(",").each(function(word) {
				word = word.strip();
				
				// make sure we don't return duplicate words
				if(this._validateInput(word, words)) {
					words.push(word);
				}
			}.bind(this));
			
			this._setCurrentValue(words);
		}
		
		this.notifyListeners("onValueChanged");
		this.checkForRequired();
	},
	
	checkForRequired: function() {
		if(this.getEditMode()) {
			if(this.options.required && (!this._getCurrentValue() || this._getCurrentValue().length == 0)) {
				this.addClass("error");
				return false;
			} else {
				this.setError(false);
			}
		}
		return true;
	}
});
