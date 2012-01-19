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

			if(Object.isArray(this.options.options)) {
				this.setOptions(this.options.options);
			}
		} catch(e) {
			Log.error("Error constructing DropDown", e);
		}
	},

	_getRawValue: function() {
		var index = this.getRootNode().value;

		return this.options.options[index].value;
	},

	_setRawValue: function(value) {
		if(!Object.isArray(this.options.options)) {
			return;
		}

		var optionElements = $A(this.getRootNode().getElementsByTagName("option"));

		optionElements.each(function(option) {
			delete option.selected;
		});

		this.options.options.each(function(option, index) {
			if(option.value == value) {
				if(optionElements[index]) {
					optionElements[index].selected = true;
				}
			}
		}.bind(this));
	},

	setOptions: function(options) {
		// preserve currently selected index
		var selectedIndex = 0;

		$A(this.getRootNode().getElementsByTagName("option")).each(function(option, index) {
			if (option.selected) {
				selectedIndex = index;

				throw $break;
			}
		});

		this.empty();

		options.each(function(option, index) {
			var node = DOMUtil.createElement("option", option.key, {value: index});

			if (index == selectedIndex) {
				node.selected = true;
			}

			this.appendChild(node);
		}.bind(this));

		this.options.options = options;
	}
});
