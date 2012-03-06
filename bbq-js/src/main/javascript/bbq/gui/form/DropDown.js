include(bbq.gui.form.FormField);

bbq.gui.form.DropDown = new Class.create(bbq.gui.form.FormField, /** @lends bbq.gui.form.DropDown.prototype */ {
	/**
	 * @example
	 * <pre><code class="language-javascript">
	 * var dropDown = new bbq.gui.form.DropDown({
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

			this.setRootNode("select");
			this.addClass("DropDown");

		} catch(e) {
			Log.error("Error constructing DropDown", e);
		}
	},

	/**
	 * Renders the option list and selects the option that is currently selected
	 */
	render: function() {

		// Get the current value before emptyng the element!
		var value = this._getRawValue();

		this.empty();

		if(!Object.isArray(this.options.options)) {
			return;
		}

		this.options.options.each(function(option, index) {

			var node = DOMUtil.createElement("option", option.key, {value: index});

			if(option.value == value) {
				node.selected = true;
			}

			this.appendChild(node);

		}.bind(this));
	},

	_getRawValue: function() {

		// If the dropdown has been rendered, get the current value via the selected <option>, otherwise return options.value
		if(this.getRootNode().getElementsByTagName("option").length == 0) {
			return this.options.value;
		}

		var index = this.getRootNode().value,
			option = this.options.options[index];

		// _getRawValue might be being called by render after setOptions - in which case there may no longer be an 
		// option at the index of the currently selected <option>
		return option ? option.value : null;
	},

	_setRawValue: function($super, value) {

		if(!Object.isArray(this.options.options)) {
			return;
		}

		var optionElements = $A(this.getRootNode().getElementsByTagName("option"));

		// If the dropdown hasn't been rendered yet, _setRawValue has the effect of updating options.value 
		if(optionElements.length == 0) {
			this.options.value = value;
			return;
		}

		this.options.options.each(function(option, index) {

			if(option.value == value) {

				optionElements[index].selected = true;
				$super(index);

			} else {

				optionElements[index].selected = false;
			}

		}, this);
	},

	setOptions: function(options) {

		// Set new options
		this.options.options = options;

		// Re-render the <option>'s
		this.render();
	}
});
