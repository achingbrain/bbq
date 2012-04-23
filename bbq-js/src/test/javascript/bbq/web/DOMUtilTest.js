include(bbq.gui.GUIWidget);
include(bbq.web.DOMUtil);

test = new Test.Unit.Runner({

	testSetStyle: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			
			DOMUtil.setStyle(widget, "width", "100px");
			
			// test via getStyle method
			this.assertEqual("100px", widget.getStyle("width"), "getStyle returned incorrect value");

			// test via DOM node
			this.assertEqual("100px", widget.getRootNode().style.width, "DOM node had incorrect value");
		}
	},
	
	testSetStyleMultiple: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			
			DOMUtil.setStyle(widget, {
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
	
	testEmptyNode: function() {
		with (this) {
			var widget = new bbq.gui.GUIWidget();
			widget.appendChild(DOMUtil.createElement("p", "Hello world"));
			
			var receivedOnBeforeRemove = false;
			var receivedOnAfterRemove = false;
			
			var widget2 = new bbq.gui.GUIWidget();
			widget2.registerListener("onBeforeRemoveFromDOM", function() {
				receivedOnBeforeRemove = true;
			});
			widget2.registerListener("onAfterRemoveFromDOM", function() {
				receivedOnAfterRemove = true;
			});
			widget.appendChild(widget2);
			
			DOMUtil.emptyNode(widget);
			
			this.assertEqual(true, receivedOnBeforeRemove, "Did not receive onBeforeRemoveFromDOM event");
			this.assertEqual(true, receivedOnAfterRemove, "Did not receive onAfterRemoveFromDOM event");
			this.assertEqual(0, widget.getRootNode().childNodes.length, "Widget still had child nodes!");
		}
	}
});
