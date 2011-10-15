include(bbq.gui.GUIWidget);
include(bbq.gui.updateables.UpdateableField);
include(bbq.gui.ProgressBar);
include(bbq.web.FileUploader);
include(bbq.util.BBQUtil);

/**
 * @class bbq.gui.SWFUploadBox
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.SWFUploadBox = new Class.create(bbq.gui.GUIWidget, {
	
	_fileUploader: null,
	_progressBar: null,
	_percentage: null,
	
	_uploadButton: null,
	_deleteButton: null,
	
	_uploadData: null,
	_fileName: null,
	_fileSize: null,
	
	/**
	 * Supoprts the following options:
	 * 
	 * options: {
	 * 		extensions: Array		// Optional - an array of allowed file extensions: ["csv", "tsv", "txt"] 
	 * 		description: String		// Optional - file extensions description: "Contacts, *.csv, *.tsv, *.txt"
	 * 		uploadButton: Boolean		// Optional - restricts creation of upload button, 
	 *  	uploadTo: String		// Required - Upload path		
	 * }
	 * 
	 * Supports the following callbacks:
	 * 
	 * onFileSelected
	 * onUploadCancel
	 * onUploadProgress
	 * onUploadComplete
	 * onUploadError
	 * onInvalidFileExtension
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("ul");
		this.addClass("SWFUploadBox");
		
		this._fileName = null;
		this._fileSize = null;
		
		this._fileUploader = new bbq.web.FileUploader({transparent: true, description: this.options.description, extensions: this.options.extensions});	
		this._progressBar = new bbq.gui.ProgressBar({barText: Language.get("bbq.gui.SWFUploadBox.choosefile")});
		this._percentage = new bbq.gui.updateables.UpdateableField({initialValue: "0%"});
		
		if(Object.isUndefined(this.options.uploadButton)) {
			this._uploadButton = false;
		} else {
			this._uploadButton = this.options.uploadButton;
		}
		
		this.appendChild(DOMUtil.createTextElement("li", this._progressBar));
		this.appendChild(DOMUtil.createTextElement("li", this._percentage, {className:"Percentage"}));
		this.appendChild(DOMUtil.createTextElement("li", this._fileUploader));
		
		this._fileUploader.registerListener("onLoad", function() {
			this._fileUploader.setButtonText(Language.get("bbq.gui.SWFUploadBox.browse"));
		}.bind(this));
		
		this._fileUploader.registerListener("onFileSelected", function() {
			this.notifyListeners("onFileChosen");
			
			this._fileName = this._fileUploader.getFileName();
			this._fileSize = this._fileUploader.getBytesTotal();
			
			this._progressBar.setBarTextAndSize(this._getFileName(this._fileName) +" "+ BBQUtil.formatFileSize(this._fileSize), 0);
			
			if(this._uploadButton) {
				this._uploadButton.setDisabled(false);
			}else{
				this.beginUpload();
			}
		}.bind(this));
		
		this._fileUploader.registerListener("onUploadCancel", function() {
			Log.info("onUploadCancel");
			this.notifyListeners("onUploadCancel");
			
			if(this._uploadButton) {
				this._uploadButton.setDisabled(true);
			}
			
			this._fileName = Language.get("bbq.gui.SWFUploadBox.choosefile");
			
			this._percentage.setValue("0%");
			this._progressBar.setBarTextAndSize(this._getFileName(this._fileName), 0);
			
			this._fileUploader.setButtonText(Language.get("bbq.gui.SWFUploadBox.browse"));
			this._fileUploader.setBrowse(true);
		}.bind(this));
		
		this._fileUploader.registerListener("onUploadComplete", function() {
			this._percentage.setValue("100%");
			this._progressBar.setBarSize(200);
			this._progressBar.render();
			this._getUploadData();
			
			this.notifyListeners("onUploadComplete");
			if(this._uploadButton) {
				this._uploadButton.setDisabled(true);
			}
		}.bind(this));
		
		this._fileUploader.registerListener("onUploadError", function() {
			this.notifyListeners("onUploadError");
			if(this._uploadButton) {
				this._uploadButton.setDisabled(true);
			}
		}.bind(this));
		
		this._fileUploader.registerListener("onUploadProgress", function() {
			this.notifyListeners("onUploadProgress");
			
			if(this._uploadButton) {
				this._uploadButton.setDisabled(true);
			}
			
			var completed = Math.round((this._fileUploader.getBytesSent()/this._fileSize)*100);
			this._percentage.setValue(completed+"%");
			this._progressBar.setBarSize(Math.round(completed*2));
			this._progressBar.render();
		}.bind(this));
	},
	
	appendBefore: function(parentNode, beforeNode) {
		parentNode.insertBefore(this.getRootNode(), beforeNode);
	},
	
	beginUpload: function() {
		if(this._fileName) {
			var extension = this._fileName.split(".").pop().toLowerCase();
			if(this.options.extensions instanceof Array && this.options.extensions.indexOf(extension) == -1) {
				this.notifyListeners("onInvalidFileExtension");
				Log.info("Invalid file extensions");
				return;
			}
			
			this._fileUploader.setBrowse(false);
			this._fileUploader.setButtonText(Language.get("bbq.gui.SWFUploadBox.cancel"));
			this._fileUploader.startUpload();
		}
	},
	
	cancelUpload: function() {
		this._fileUploader.cancelUpload();
	},
	
	_getUploadData: function() {		
		this._uploadData = this._fileUploader.getData();
	},
	
	getUploadData: function() {
		return this._uploadData;
	},
	
	getUploadError: function() {
		return this._uploadData;
	},
	
	/**
	 * @private
	 */
	_getFileName: function(fileName) {
		return (fileName.length > 19 ? fileName.substr(0, 8) + "..." + fileName.substr(fileName.length - 8, 8) : fileName);
	},
	
	getFileName: function() {
		return this._fileName;
	},
	
	getFileSize: function() {
		return this._fileSize;
	},
	
	getFileTransferID: function() {
		var data = this.getUploadData();
		Log.dir(data);
		return data["filetransferid"];
	}	
});
