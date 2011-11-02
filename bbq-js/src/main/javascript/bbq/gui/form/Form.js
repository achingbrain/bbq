include(bbq.gui.GUIWidget);
include(bbq.gui.form.FormField);
include(bbq.gui.button.GUIButton);
include(bbq.gui.form.TextField);

/**
 * @class bbq.gui.form.Form
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.form.Form = new Class.create(bbq.gui.GUIWidget, {
	_submitButton: null,

	/**
	 * @param {Object} options
	 * @example
	 * Todo an example
	 */
	initialize: function($super, options) {
		$super(options);

		this.setRootNode("form");
		this.addClass("Form");
	},

	getValues: function() {
		var output = {};

		this._walkForValues(this.getRootNode(), output);

		return output;
	},

	_walkForValues: function(node, values) {
		var children = $A(node.childNodes);

		children.each(function(child) {
			if(child.owner && child.owner() instanceof bbq.gui.form.FormField) {
				var formField = child.owner();

				if(formField.getName()) {
					values[formField.getName()] = formField.getValue();
				}
			}

			this._walkForValues(child, values);
		}.bind(this));
	},

	render: function() {

		this._walkForSubmitButtons(this.getRootNode());
		this._walkForTextFields(this.getRootNode());
	},

	_walkForSubmitButtons: function(node) {
		var children = $A(node.childNodes);

		children.each(function(child) {
			if(child.owner && child.owner() instanceof bbq.gui.button.GUIButton) {
				this._submitButton = child.owner();
			}

			this._walkForSubmitButtons(child);
		}.bind(this));
	},

	_walkForTextFields: function(node) {
		var children = $A(node.childNodes);

		children.each(function(child) {
			if(child.owner && child.owner() instanceof bbq.gui.form.TextField) {
				var field = child.owner();
				
				Event.observe(field.getRootNode(), "keypress", this._shouldSubmit.bindAsEventListener(this));
			}

			this._walkForTextFields(child);
		}.bind(this));
	},

	_shouldSubmit: function(event) {
		if (event.keyCode == Event.KEY_RETURN) {
			Event.stop(event);

			if(this._submitButton) {
				this._submitButton.buttonClicked();
			}
		}
	}
});
