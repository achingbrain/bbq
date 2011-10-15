include(bbq.gui.updateables.UpdateableField);
include(bbq.gui.FileUploaderFlash);
include(deadline.gui.uploads.FileUploader);

/**
 * @class bbq.gui.updateables.UpdateableImageField
 * @extends bbq.gui.updateables.UpdateableField
 */
bbq.gui.updateables.UpdateableImageField = new Class.create(bbq.gui.updateables.UpdateableField, {
	
	_oldImage: null,
	_currentImage: null,
	_chooseButtonHolder: null,
	_currentImageNode: null,
	_fileUploaded: null,
	
	/**
	 * @param {Object} options
	 * @example
	 * Supports the following options:
	 * 
	 * options: {
	 * 		getImage: function						// should return the path to the image
	 * 		uploadTo										// Where to POST the image
	 * 		language: Object							// passed to a bbq.gui.FileUploader object
	 * 		deleteButtonText							// Text displayed on the delete button - defaults to "Remove"
	 * }
	 * 
	 * Supports the following callbacks
	 * 
	 * onFileDeleted
	 * onFileChosen
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("UpdateableImageField");
		
		if(this._getImage()) {
			this._oldImage = this._getImage();
			this._currentImage = this._getImage();
			
			this.addClass("UpdateableImageField_WithImage");
		}
		
		this._setCurrentValue(null);
		
		this._chooseImageButtonText = Language.get("bbq.gui.updateables.UpdateableImageField.uploadfile");
		this._deleteImageButtonText = this.options.deleteButtonText ? this.options.deleteButtonText : Language.get("bbq.gui.updateables.UpdateableImageField.remove");
	},
	
	_updateInitialValues: function() {
		this._currentImage = this._getImage();
		this.render();
	},
	
	_getImage: function() {
		if(this.options.getImage && this.options.getImage instanceof Function) {
			var entity = this.options.propertyDisplay ? this.options.propertyDisplay.entity : null;
			
			return this.options.getImage(entity);
		}
		
		return false;
	},
	
	setPropertyDisplay: function(key, entity) {
		if(this._currentImageNode) {
			this._currentImageNode.onload = null;
			this._currentImageNode = null;
		}
		
		bbq.gui.updateables.UpdateableField.prototype.setPropertyDisplay.apply(this, arguments);
	},
	
	_createImage: function() {
		this.addClass("UpdateableImageField_WithImage");
		this.setStyle("paddingTop", "0px");
		this.setStyle("paddingBottom", "0px");
		
		if(!this._currentImageNode) {
			if(!this._fileUploaded && this.options.propertyDisplay) {
				Log.info("have property display");
				this._currentImageNode = this.options.propertyDisplay.entity.getPropertyDisplay({
					property: this.options.propertyDisplay.key, 
					createNode: function() {
						return DOMUtil.createElement("img");
					},
					updateNode: function(node, property) {
						node.src = this._currentImage;
					}.bind(this)
				});
			} else {
				Log.info("creating from passed value");
				this._currentImageNode = DOMUtil.createElement("img", {src: this._currentImage, alt: ""});
			}
			
			this._currentImageNode.onload = function() {
				var height = this._currentImageNode.height;
				var width = this._currentImageNode.width;
				
				if(height == 0 && width == 0) {
					return;
				}
				
				if(width < 128) {
					DOMUtil.setStyle(this._currentImageNode, "marginLeft", Math.round((128 - width)/2) + "px");
				}
				
				if(height < 128) {
					var padding = Math.round((128 - height)/2) + "px";
					
					DOMUtil.setStyle(this._currentImageNode, "marginTop", padding);
					DOMUtil.setStyle(this._currentImageNode, "marginBottom", padding);
				}
			}.bind(this);
		}
		
		this.appendChild(this._currentImageNode);
	},
	
	createEditField: function() {
		this.empty();
		
		if(this._currentImage) {
			this._createImage();
		} else {
			this.removeClass("UpdateableImageField_WithImage");
			this.setStyle("paddingTop", "128px");
		}
		
		this._chooseButtonHolder = new bbq.gui.button.ButtonHolder({ignoreKeyPresses: true});
		
		if(this._currentImage) {
			this._chooseButtonHolder.addButton(new bbq.gui.button.NativeButton({buttonText: this._deleteImageButtonText, onclick: this._deleteFile.bind(this)}));
		}
		
		this._chooseButtonHolder.addButton(new bbq.gui.button.NativeButton({buttonText: this._chooseImageButtonText, onclick: this.options.uploadFunction ? this.options.uploadFunction.bind(this, this) : this._showFilePickerWindow.bind(this)}));
		
		this.appendChild(this._chooseButtonHolder);
	},
	
	createViewField: function() {
		this.empty();
		
		if(this._currentImage) {
			this._createImage();
		} else {
			this.removeClass("UpdateableImageField_WithImage");
			this.setStyle("paddingTop", "128px");
		}
	},
	
	_deleteFile: function() {
		this._setCurrentValue(-1);
		
		this._fileUploaded = false;
		this._currentImage = false;
		this.render();
		this.notifyListeners("onFileRemoved");
		this.notifyListeners("onValueChanged");
	},
	
	_showFilePickerWindow: function() {
		var filePicker = new deadline.gui.uploads.FileUploader({
			title: "Upload image",
			description: "Images",
			extensions: ["jpg", "gif", "png"],
			multiple: this.options.multiple
		});
		filePicker.registerListener("onFilesUploaded", this._filesUploaded.bind(this));
		currentPage.addModalLayer(filePicker);
	},
	
	_filesUploaded: function(imagePicker) {
		var files = imagePicker.getFiles();
		
		if(files.length > 0) {
			this._fileUploaded = true;
			this._currentImageNode = false;
			
			this._oldImage = this._currentImage;
			
			if(files.length == 1) {
				this._currentImage = "/backend/uploads/getTemporaryThumbnail?id=" + files[0].filetransferid;
			} else {
				//this._currentImage = "/img/icons/128x128/content-types/multiple.png";
				this._currentImage = "/backend/uploads/getTemporaryThumbnail?id=" + files[0].filetransferid;
			}
			
			if(this.options.multiple) {
				this._setCurrentValue(files.pluck("filetransferid"));
			} else {
				this._setCurrentValue(files[0].filetransferid);
			}
			
			this.render();
		}
		
		this.notifyListeners("onFileUploaded", files);
		this.notifyListeners("onValueChanged");
	},
	
	cancelEdit: function() {
		this._setCurrentValue(null);
		this._currentImage = this._oldImage;
		this._fileUploaded = false;
		this.createViewField();
	},
	
	saveEdit: function() {
		if(this._getCurrentValue() == -1) {
			this.notifyListeners("onFileDeleted");
		} else {
			if(this.options.propertyDisplay) {
				// set current value to null - old value was previously uploaded file so set to null so we don't try to overwrite it with one that now will not exist
				this.currentValue = null;
			}
		}
		
		this._oldImage = this._getImage();
		this._currentImage = this._getImage();
	},
	
	getValue: function(supressError) {
		return this._getCurrentValue(supressError);
	},
	
	setDisabled: function($super, disabled) {
		$super(disabled);
		
		if(this._chooseButtonHolder) {
			this._chooseButtonHolder.setDisabled(disabled);
		}
	}
});
