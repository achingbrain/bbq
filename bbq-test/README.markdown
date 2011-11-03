
# Tests

bbq supports headless JavaScript unit tests intended to be run as part of your [CI](http://en.wikipedia.org/wiki/Continuous_integration) build.

## An example test

By default bbq uses the unit testing framework supplied with Scriptaculous.  A sample test would look like:

	include(com.myapp.MyClass);

	test = new Test.Unit.Runner({
		subject: null,

		setup: function() {
			with (this) {
				this.subject = new com.myapp.MyClass();
			}
		},

		teardown: function() {
			with (this) {

			}
		},

		testSomething: function() {
			with (this) {
				var expected = "foo";

				this.assertEqual(expected, this.subject.bar());
			}
		}
	});

Tests are run headlessly under [Mozilla Rhino](http://www.mozilla.org/rhino/) and include a pretty good DOM implementation courtesty of [env.js](http://www.envjs.com/).

Each test file is compiled before it is run so you you can use

	include()

in your tests in the same way as your main JavaScript classes.

## Extra functions

If you want to write something out to stdout, use the print function.  e.g.:

	print("this will be echoed to the console");

## Using your own test runner

To run with bbq-js a JavaScript unit test file should have a global variable named "test" which has a method named "summary"  This method should return an object like this:

	{
		tests: 0,                       // The number of tests run
		failed: 0,                      // How many failed
		errors: 0,                     // How many errors occured
		messages: [
			"A list of error messages",
			"Another error message"
		]
	}

This is the format supported by Scriptaculous' test runner.  If you wish to use something different it should follow the rules above.
