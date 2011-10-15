include(bbq.gui.updateables.UpdateableTextField);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.updateables.UpdateableEmailField
 * @extends bbq.gui.updateables.UpdateableTextField 
 */
bbq.gui.updateables.UpdateableEmailField = new Class.create(bbq.gui.updateables.UpdateableTextField, {

	getValue: function($super, supressErrorWarning) {
		if(!supressErrorWarning && !BBQUtil.isValidEmail(this._getCurrentValue())) {
			this.triggerError();
		}

		return $super(supressErrorWarning);
	}
});
