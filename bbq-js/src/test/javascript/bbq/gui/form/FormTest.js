include(bbq.gui.form.Form);
include(bbq.gui.form.TextField);
include(bbq.gui.form.validator.NotNullValidator);

// shim in support for simulating keyboard events to Rhino, grumble grumble
if(!Event.prototype.initKeyEvent) {
	Event.prototype.initKeyEvent = function(type, bubbles, cancelable, windowObject, ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode) {
		this.initUIEvent(type, bubbles, cancelable, windowObject, 0);
		this._ctrlKey = ctrlKey;
		this._altKey = altKey;
		this._shiftKey = shiftKey;
		this._metaKey = metaKey;
		this._keyIdentifier = keyCode;
		this._keyLocation = charCode;
		this.keyCode = keyCode;
	}
}

if (!Event.prototype.initKeyboardEvent) {
	Event.prototype.initKeyboardEvent = Event.prototype.initKeyEvent;
}

test = new Test.Unit.Runner({

	testGetValues: function() {
		with (this) {
			var form = new bbq.gui.form.Form();

			var field = new bbq.gui.form.TextField({name: "foo"});
			field.getRootNode().value = "bar";

			form.appendChild(field);

			form.render();

			var values = form.getValues();

			this.assertEqual("bar", values["foo"]);
		}
	},

	testGetValues_requiredField: function() {
		with (this) {
			var form = new bbq.gui.form.Form();

			var field = new bbq.gui.form.TextField({name: "baz"});
			field.addValidator(new bbq.gui.form.validator.NotNullValidator());

			form.appendChild(field);

			form.render();

			try {
				var values = form.getValues();

				this.fail("Should have thrown an exception");
			} catch(e) {
				// an exception here is expected
			}
		}
	},

	testGetValues_submitButton: function() {
		with (this) {
			var form = new bbq.gui.form.Form();

			var field = new bbq.gui.form.TextField({name: "baz"});
			form.appendChild(field);

			var submitted = false;

			var button = new bbq.gui.button.GUIButton({
				onClick: function() {
					submitted = true;
				}
			});
			form.appendChild(button);

			form.render();

			// trigger enter keypress in text field
			Event.simulateKeys(field.getRootNode(), "bar");
			Event.simulateKey(field.getRootNode(), "keypress", {keyCode:Event.KEY_RETURN});

			this.assertEqual(true, submitted);
		}
	}
});
