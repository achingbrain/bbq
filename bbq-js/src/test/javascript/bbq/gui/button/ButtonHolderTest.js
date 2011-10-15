include(bbq.gui.button.ButtonHolder);
include(bbq.gui.button.GUIButton);

test = new Test.Unit.Runner({

	testButtonClicked: function() {
		with (this) {
			var button1 = new bbq.gui.button.GUIButton();
			var button2 = new bbq.gui.button.GUIButton();

			var holder = new bbq.gui.button.ButtonHolder();
			holder.addButton(button1);
			holder.addButton(button2);

			this.assertEqual(-1, holder.getSelectedIndex());

			button2.buttonClicked();

			this.assertEqual(1, holder.getSelectedIndex());

			button1.buttonClicked();

			this.assertEqual(0, holder.getSelectedIndex());
		}
	}
});
