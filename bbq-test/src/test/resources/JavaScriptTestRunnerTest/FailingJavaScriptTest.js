test = new Test.Unit.Runner({
	setup: function() { with(this) {
	}},
	
	teardown: function() { with(this) {
		
	}},
	
	testSomething: function() { with(this) {
		
	}},
	
	testSomethingElse: function() { with(this) {
		this.fail("This error message will be printed but only the last one will be shown next to the failing test name");
	}},
	
	testSomethingOtherThing: function() { with(this) {
		this.fail("Oh noes!");
	}}
});