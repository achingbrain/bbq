include(bbq.gui.form.FormField);

/**
 * Supports the following options:
 *
 * options: {
 *      options: [
 *          key: String
 *          value: Object
 *      ]
 * }
 */
bbq.gui.form.DropDown = new Class.create(bbq.gui.form.FormField, {
	initialize: function($super, args) {
		try {
			$super(args);

			this.setRootNode("select");
			this.addClass("DropDown");

			if(Object.isArray(this.options.options)) {
				this.setOptions(this.options.options);
			}

			if(!Object.isUndefined(this.options.value)) {
				this.setValue(this.options.value);
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

		this.options.options.each(function(option, index) {
			if(option.value == value) {
				var optionElements = $A(this.getRootNode().getElementsByTagName("option"));

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
	}
});
