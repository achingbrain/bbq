include(bbq.gui.updateables.UpdateableImageField);

/**
 * @class bbq.gui.updateables.UpdateableFileField
 * @extends  bbq.gui.updateables.UpdateableImageField
 */
bbq.gui.updateables.UpdateableFileField = new Class.create(bbq.gui.updateables.UpdateableImageField, {
	/**
	 * @param {Object} options
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._chooseImageButtonText = (this.options.multiple ? Language.get("bbq.gui.updateables.UpdateableFileField.uploadfiles") : Language.get("bbq.gui.updateables.UpdateableFileField.uploadfile"));
		this.addClass("UpdateableFileField");
	},
	
	/**
	 * @param {Event} event
	 */
	_showFilePickerWindow: function(event) {
		var filePicker = new deadline.gui.uploads.FileUploader({
			title: this._chooseImageButtonText,
			multiple: this.options.multiple
		});
		filePicker.registerListener("onFilesUploaded", this._filesUploaded.bind(this));
		currentPage.addModalLayer(filePicker);
	}
});
