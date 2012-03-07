include(bbq.gui.form.DropDown);
include(bbq.util.BBQTestUtil);

test = new Test.Unit.Runner({
	
	_dropDown: null,
	
	_option1: null,
	_option2: null,
	_option3: null,
	
	setup: function() {
		
		BBQTestUtil.redirectLog(this);
		BBQTestUtil.mockLanguage();
		
		this._option1 = {key: 'Option 1', value: 1};
		this._option2 = {key: 'Option 2', value: 2};
		this._option3 = {key: 'Option 3', value: 3};
		
		this._dropDown = new bbq.gui.form.DropDown({
			value: this._option2.value,
			options: [this._option1, this._option2, this._option3]
		});
		
		this.info('Running ' + this.name);
	},
	
	teardown: function() {
		BBQTestUtil.restoreLog();
		BBQTestUtil.restoreLanguage();
	},
	
	/**
	 * Test the dropdown can be rendered without error
	 */
	testRender: function() {
		
		// Method under test
		this._dropDown.render();
		
		var options = this._dropDown.getRootNode().getElementsByTagName("option");
		
		// 3 <option> elements should have been appended to the root node
		this.assertEqual(3, options.length);
		
		// <option> inner HTML should be equal to the option keys passed to the class
		this.assertEqual(this._option1.key, options[0].innerHTML);
		this.assertEqual(this._option2.key, options[1].innerHTML);
		this.assertEqual(this._option3.key, options[2].innerHTML);
		
		// Option 2 should be selected
		this.assertEqual(true, options[1].selected);
	},

	/**
	 * Test the correct value is returned when requested
	 */
	testGetValue: function() {
		
		this._dropDown.render();
		
		// Method under test
		var value = this._dropDown.getValue();
		
		this.assertEqual(this._option2.value, value);
	},

	/**
	 * Test setting a value changes the selected <option> and value returned by getValue correctly
	 */
	testSetValue: function() {
		
		this._dropDown.render();
		
		this.assertEqual(this._option2.value, this._dropDown.getValue());
		
		// Method under test
		this._dropDown.setValue(this._option3.value);
		
		this.assertEqual(this._option3.value, this._dropDown.getValue());
		
		var options = this._dropDown.getRootNode().getElementsByTagName("option");
		
		this.assertEqual(true, options[2].selected);
	},
	
	/**
	 * Test outcome when setting a value that isn't in the options
	 */
	testSetValueUnknown: function() {
		
		this._dropDown.render();
		
		this.assertEqual(this._option2.value, this._dropDown.getValue());
		
		// Method under test
		this._dropDown.setValue(138);
		
		this.assertEqual(null, this._dropDown.getValue());
	},
	
	/**
	 * Test that the set of options the dropdown manages can be updated
	 */
	testSetOptions: function() {
		
		this._dropDown.render();
		
		var optionNodes = this._dropDown.getRootNode().getElementsByTagName("option");
		
		this.assertEqual(3, optionNodes.length);
		
		var newOptions = [{key: 'foo', value: 'bar'}, {key: 'baz', value: 'boz'}];
		
		// Method under test
		this._dropDown.setOptions(newOptions);
		
		optionNodes = this._dropDown.getRootNode().getElementsByTagName("option");
		
		// Should now have two options
		this.assertEqual(2, optionNodes.length);
		
		this.assertEqual('foo', optionNodes[0].innerHTML);
		this.assertEqual('baz', optionNodes[1].innerHTML);
	},

	/**
	 * Test that if the order of the options changes, then the selected index doesn't change, but the value does
	 */
	testSetOptionsMaintainsSelectedIndex: function() {
		
		this._dropDown.render();
		
		var optionNodes = this._dropDown.getRootNode().getElementsByTagName("option");
		
		// Assert that option2's key is at position 1 in the DOM
		this.assertEqual(this._option2.key, optionNodes[1].innerHTML);
		
		// Assert that the currently selected value is option2's value
		this.assertEqual(this._option2.value, this._dropDown.getValue());
		
		// Note option3 is now at index 1
		var newOptions = [this._option1, this._option3, this._option2];
		
		// Method under test
		this._dropDown.setOptions(newOptions);
		
		// Get the new nodes
		optionNodes = this._dropDown.getRootNode().getElementsByTagName("option");
		
		// Assert that option3's key is at position 1 in the DOM
		this.assertEqual(this._option3.key, optionNodes[1].innerHTML);
		
		// Assert that the currently selected value is now option3's value
		this.assertEqual(this._option3.value, this._dropDown.getValue());
	}
});
