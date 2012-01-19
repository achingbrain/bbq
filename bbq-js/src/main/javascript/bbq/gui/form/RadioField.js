include(bbq.gui.form.FormField);

bbq.gui.form.RadioField = new Class.create(bbq.gui.form.FormField, /** @lends bbq.gui.form.RadioField.prototype */ {

	/**
	 * @example
	 * <pre><code class="language-javascript">
	 * var dropDown = new bbq.gui.form.RadioField({
	 *     options: [
	 *          {key: "Option 1", value: 1},
	 *          {key: "Option 2", value: 2}
	 *     ]
	 * })
	 * </code></pre>
	 * @constructs
	 * @extends bbq.gui.form.FormField
	 * @param {Object} options
	 * @param {Object[]} options.options Array members should be objects with two fields {String} key and {Object} value
	 */
	initialize: function($super, options) {
		try {
			$super(options);

			this.setRootNode("div");
			this.addClass("RadioField");

			if(Object.isUndefined(this.options.name)) {
				this.options.name = BBQUtil.generateGUID();
			}

			if(Object.isArray(this.options.options)) {
				this.setOptions(this.options.options);
			}

			if(!Object.isUndefined(this.options.value)) {
				this._setRawValue(this.options.value);
			}
		} catch(e) {
			Log.error("Error constructing RadioField", e);
		}
	},

	_getRawValue: function() {
		var index = 0;

		$A(this.getRootNode().getElementsByTagName("input")).each(function(radio, i) {
			if(radio.checked) {
				index = i;
			}
		});

		// return the option value rather than that stored on the input node
		// as booleans get converted to 0 and 1 and other such silliness
		return this.options.options[index].value;
	},

	_setRawValue: function(value) {
		if(!Object.isArray(this.options.options)) {
			return;
		}

		var radioElements = this.getRootNode().getElementsByTagName("input");

		if(radioElements.length == 0) {
			return;
		}

		this.options.options.each(function(option, index) {
			var radio = radioElements[index];

			if(value == option.value) {
				radio.checked = true;
			} else {
				radio.checked = false;
			}
		}.bind(this));
	},

	setOptions: function(options) {
		// preserve currently selected index
		var selectedIndex = 0;

		$A(this.getRootNode().getElementsByTagName("input")).each(function(radio, index) {
			if(radio.checked) {
				selectedIndex = index;

				throw $break;
			}
		});

		this.empty();

		options.each(function(option, index) {
			this.appendChild(DOMUtil.createElement("label", [
				option.key,
				DOMUtil.createElement("input", {
					value: index,
					type: "radio",
					name: this.options.name,
					checked: index == selectedIndex,
					onchange: this.notifyListeners.bind(this, "onChange")
				})
			]));
		}.bind(this));

		this.options.options = options;
	}
});
