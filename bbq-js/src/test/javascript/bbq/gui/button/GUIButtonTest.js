include(bbq.gui.button.GUIButton);
include(bbq.util.BBQTestUtil);

test = new Test.Unit.Runner({
	
	_button: null,
	
	setup: function() {
		
		BBQTestUtil.redirectLog(this);
		BBQTestUtil.mockLanguage();
		
		this._button = new bbq.gui.button.GUIButton({text: 'foo'});
		
		this.info('Running ' + this.name);
	},
	
	teardown: function() {
		BBQTestUtil.restoreLog();
		BBQTestUtil.restoreLanguage();
	},

	/**
	 * Test the button can be rendered successfully
	 */
	testRender: function() {
		this._button.render();
	},

	/**
	 * Test the button text can be changed
	 */
	testSetText: function() {
		
		this._button.render();
		
		var node = this._button.getRootNode();
		
		// Setup function should set this value to "foo"
		this.assertEqual(node.innerHTML, 'foo');
		
		// Method under test
		this._button.setText('bar');
		
		// Text should have changed to "bar"
		this.assertEqual(node.innerHTML, 'bar');
	}
});
