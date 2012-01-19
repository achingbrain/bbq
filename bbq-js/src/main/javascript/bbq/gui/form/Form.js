include(bbq.gui.GUIWidget);
include(bbq.gui.form.FormField);
include(bbq.gui.button.GUIButton);
include(bbq.gui.form.TextField);

bbq.gui.form.Form = new Class.create(bbq.gui.GUIWidget, /** @lends bbq.gui.form.Form.prototype */ {
	_submitButton: null,

	/**
	 * This is a collection of form fields with names and values.  Calling Form#getValues returns
	 * a key/value Object of values.
	 *
	 * @example
	 * <pre><code class="language-javascript">
	 * // create two fields
	 * var field1 = new bbq.gui.form.TextField({name: "foo"});
	 * var field2 = new bbq.gui.form.TextField({name: "bar"});
	 *
	 * // add them to our form
	 * var form = new bbq.gui.form.Form();
	 * form.appendChild(field1);
	 * form.appendChild(field2);
	 *
	 * // set the values on the fields
	 * field1.setValue("hello");
	 * field2.setValue("world");
	 *
	 * // returns {foo: "hello", bar: "world"}
	 * form.getValues();
	 * </code></pre>
	 * @constructs
	 * @extends bbq.gui.GUIWidget
	 * @param {Object} options
	 */
	initialize: function($super, options) {
		$super(options);

		this.setRootNode("form");
		this.addClass("Form");
	},

	/**
	 * @throws {Error} The error has two fields {String} error for language translations and {bbq.gui.form.FormField} field which is the field which caused the error.
	 * @returns {Object} Key/value parings of form elements previously added to this form.
	 */
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

	/**
	 * @inheritDoc
	 */
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
