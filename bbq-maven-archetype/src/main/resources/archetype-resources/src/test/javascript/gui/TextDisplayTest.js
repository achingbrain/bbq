#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
include(${package}.gui.TextDisplay);

test = new Test.Unit.Runner({

	_textDisplay: null,

	setup: function() {
		this._textDisplay = new ${package}.gui.TextDisplay();
	},

	testClassNameSet: function() {
		with(this) {
			assertEqual(true, _textDisplay.hasClass("TextDisplay"));
		}
	},

	/**
	 * I test that call setText will, in fact, set the text
	 */
	testSetText: function() {
		with(this) {

			// Method under test
			_textDisplay.setText("foo");

			// render the display
			_textDisplay.render();

			assertEqual(_textDisplay.getRootNode().innerHTML.strip(), "foo");
		}
	}
});
