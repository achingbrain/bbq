include(bbq.gui.GUIWidget);

test = new Test.Unit.Runner({

	testSetStyle: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.setStyle("width", "100px");

			// test via getStyle method
			this.assertEqual("100px", widget.getStyle("width"), "getStyle returned incorrect value");

			// test via DOM node
			this.assertEqual("100px", widget.getRootNode().style.width, "DOM node had incorrect value");
		}
	},
	
	testSetStyleMultiple: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.setStyle({
				width: "100px",
				height: "50px"
			});

			// test via getStyle method
			this.assertEqual("100px", widget.getStyle("width"), "getStyle returned incorrect value");
			this.assertEqual("50px", widget.getStyle("height"), "getStyle returned incorrect value");

			// test via DOM node
			this.assertEqual("100px", widget.getRootNode().style.width, "DOM node had incorrect value");
			this.assertEqual("50px", widget.getRootNode().style.height, "DOM node had incorrect value");
		}
	},

	testSetAttribute: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.setAttribute("foo", "bar");

			// test via getAttribute method
			this.assertEqual("bar", widget.getAttribute("foo"), "getAttribute returned incorrect value");

			// test via DOM node
			this.assertEqual("bar", widget.getRootNode()["foo"], "DOM node had incorrect value");
		}
	},
	
	testSetStyleAttribute: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.setAttribute("style", {
				color: "red"
			});

			// ensure style setting has stuck
			this.assertEqual("red", widget.getStyle("color"), "getStyle returned incorrect value");
			this.assertEqual("red", widget.getRootNode().style.color, "DOM node had incorrect value");
		}
	},
	
	testSetAttributeMultiple: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.setAttribute({
				foo: "bar",
				baz: "qux"
			});

			// test via getAttribute method
			this.assertEqual("bar", widget.getAttribute("foo"), "getAttribute returned incorrect value");
			this.assertEqual("qux", widget.getAttribute("baz"), "getAttribute returned incorrect value");

			// test via DOM node
			this.assertEqual("bar", widget.getRootNode()["foo"], "DOM node had incorrect value");
			this.assertEqual("qux", widget.getRootNode()["baz"], "DOM node had incorrect value");
		}
	},
	
	testSetStyleAttributeMultiple: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.setAttribute({
				foo: "bar",
				baz: "qux",
				style: {
					color: "red"
				}
			});

			// test via getAttribute method
			this.assertEqual("bar", widget.getAttribute("foo"), "getAttribute returned incorrect value");
			this.assertEqual("qux", widget.getAttribute("baz"), "getAttribute returned incorrect value");

			// test via DOM node
			this.assertEqual("bar", widget.getRootNode()["foo"], "DOM node had incorrect value");
			this.assertEqual("qux", widget.getRootNode()["baz"], "DOM node had incorrect value");

			// ensure style setting has stuck
			this.assertEqual("red", widget.getStyle("color"), "getStyle returned incorrect value");
			this.assertEqual("red", widget.getRootNode().style.color, "DOM node had incorrect value");
		}
	}
});
