include(bbq.gui.GUIWidget);
include(bbq.gui.button.AddButton);
include(bbq.gui.button.DeleteButton);
include(bbq.gui.button.SaveCancel);

/**
 * @class bbq.gui.FileUploader
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.FileUploader = new Class.create(bbq.gui.GUIWidget, {
	
	_numFilesDisplay: null,
	
	// where the iFrames live
	_filesToUploadDiv: null,
	_uploadTable: null,
	
	// where the thumbnails live
	_filesUploadedDiv: null,
	
	// the button that starts the upload process
	_uploadButton: null,
	addAnotherFile: null,
	fileNames: null,
	acceptedFileExtensions: null,
	warningText: null,
	
	_thumbnailDisplayMaximised: null,
	
	// holds data on files currently being uploaded
	_uploadingFileData: null,
	
	// data describing files that have been uploaded
	_uploadedFiles: null,
	
	_escapeKeyObserver: null,
	
	/**
	 * @param {object} options 
	 * 
	 * Supports the following options:
	 * options: {
	 * 		owner: Object,					// the object that will recieve the files
	 * 		multiple: boolean				// whether to accept multiple files
	 * 		sendFilesTo: String			// where to POST the files to
	 * 		language: {
	 * 
	 * 		}
	 * 		acceptedFileExtensions: Array
	 * }
	 * 
	 * Supports the following events:
	 * 
	 * onFilesUploaded
	 */
	initialize: function($super, options) {
		$super(options);
		
		this._uploadedFiles = [];
		this._uploadingFileData = [];
		this._thumbnailDisplayMaximised = false;
		
		this.setRootNode("div");
		this.addClass("FileUploader");
		
		if(this.options.multiple) {
			this.addClass("MultipleFileUploader");
		} else {
			this.addClass("SingleFileUploader");
		}
		
		this._escapeKeyObserver = function(event) {
			if(event.keyCode == Event.KEY_ESC) {
				this._cancelUpload();
			}
		}.bind(this);
		
		Event.observe(document, "keypress", this._escapeKeyObserver);
	},
	
	/**
	 * Renders
	 */
	render: function() {
		this.empty();
		
		var saveCancel = new bbq.gui.button.SaveCancel({
			saveText: "Done",
			saveCallback: this._saveUpload.bindAsEventListener(this), 
			cancelCallback: this._cancelUpload.bindAsEventListener(this),
			nativeButtons: true
		});
		saveCancel.setEditMode(true);
		
		var header = new deadline.gui.panel.HeaderPanel();
		header.setHeaderLeft(Language.get("bbq.gui.FileUploader.title"));
		header.setHeaderRight(saveCancel);
		
		this.appendChild(header);
		
		this._filesToUploadDiv = this.appendChild(DOMUtil.createTextElement("div", DOMUtil.createTextElement("h3",	[
			DOMUtil.createTextElement("span", Language.getFormatted("bbq.gui.FileUploader.maxsize", {fileSize: BBQUtil.formatFileSize(ServerConfig["uploadlimit"])})),
			Language.get("bbq.gui.FileUploader.choosefile")
		]), {className: "FilesToUpload"}));
		
		this._uploadTable = DOMUtil.createTextElement("table", DOMUtil.createElement("tbody"));
		this._filesToUploadDiv.appendChild(this._uploadTable);
		
		this._uploadButton = new bbq.gui.button.ButtonHolder({ignoreKeyPresses: true});
		this._uploadButton.addButton(new bbq.gui.button.NativeButton({buttonText: Language.get("bbq.gui.FileUploader.upload"), onclick: this._uploadFiles.bindAsEventListener(this), startDisabled: true}));
		
		var header = new deadline.gui.panel.HeaderPanel();
		//header.setHeaderRight(buttonHolder);
		
		if(this.options.multiple) {
			this._addAnother = DOMUtil.createTextElement("p", [
				new bbq.gui.button.AddButton({onclick: this._addFile.bind(this)}),
				Language.get("bbq.gui.FileUploader.addasset")
			]);
			
			header.setHeaderLeft(this._addAnother);
		}
		
		this.appendChild(header);
		
		this._filesUploadedDiv = this.appendChild(DOMUtil.createElement("div", {className:  "FilesUploaded"}));
		
		this._addFile();
	},
	
	/**
	 * @private
	 */
	_addFile: function() {
		if(!this.options.multiple && this._uploadedFiles.length != 0) {
			return;
		}
		
		$A(this._filesToUploadDiv.childNodes).each(function(node) {
			if(node.tagName.toLowerCase() == "h3") {
				node.style.display = "block";
			}
		});
		
		this._minimiseThumbnailArea();
		
		var iframe = DOMUtil.createElement("iframe");
		
		if(Browser.InternetExplorer) {
			// Internet Explorer does not like dynamically created upload boxes (it submits their contents as 
			// if they were text inputs) so load a file with a file input in it
			iframe.frameBorder = "0";
			iframe.src = "/js/uploadFile.html";
		}
		
		Event.observe(iframe, "load", function() {
			var iframeDoc = DOMUtil.getIFrameDocument(iframe);
			
			var input = DOMUtil.createElement("input", {type: "file", name: "assetFile", style: {width: "200px"}});
			
			if(!Browser.InternetExplorer) {
				var form = iframeDoc.createElement("form");
				form.method = "post";
				form.enctype = "multipart/form-data";
				form.appendChild(input);
				
				iframeDoc.body.appendChild(form);
				iframeDoc.body.style.backgroundColor = "#000";
				iframeDoc.body.style.margin = "0";
				iframeDoc.body.style.padding = "0 10px";
			} else {
				if(iframeDoc.forms && iframeDoc.forms[0] && iframeDoc.forms[0].assetFile) {
					input = iframeDoc.forms[0].assetFile;
				}
			}
			
			Event.observe(input, "change", function() {
				this._uploadButton.setDisabled(false);
				this.notifyListeners("onFileChosen");
				
				if(!this.options.multiple) {
					this._uploadFiles();
				}
			}.bind(this));
		}.bind(this));
		
		var row = DOMUtil.createTextElement("tr", [
			DOMUtil.createTextElement("td", iframe),
		]);
		
		if(this.options.multiple) {
			row.appendChild(DOMUtil.createTextElement("td", this._uploadButton));
		}
		
		this._uploadTable.getElementsByTagName("tbody")[0].appendChild(row);
		
		// store data
		this._uploadingFileData.push({
			fileUploading: false,
			row: row,
			iframe: iframe
		});
	},
	
	/**
	 * @private
	 */
	_uploadFiles: function() {
		var hasValidFiles = false;
		
		// loop through upload boxes and get file data
		for(var i = 0, iCount=this._uploadingFileData.length; i < iCount; i++) {
			var fileData = this._uploadingFileData[i];
			
			if(!fileData.fileUploading) {
				var form = DOMUtil.getIFrameDocument(fileData.iframe).forms[0];
				
				if(form && form.assetFile) {
					var assetLocation = form.assetFile.value.strip();
					
					if(!assetLocation) {
						if(this._uploadingFileData.length > 1) {
							// no file has been chosen, remove frame
							this._uploadTable.getElementsByTagName("tbody")[0].removeChild(fileData.row);
							this._uploadingFileData.splice(i, 1);
							i--;
						}
						
						continue;
					}
					
					var extension = assetLocation.split(".").pop().toLowerCase();
					
					if(this.options.extensions instanceof Array && this.options.extensions.indexOf(extension) == -1) {
						this.notifyListeners("onInvalidFileExtension");
						return;
					}
					
					var div = DOMUtil.createTextElement("div", DOMUtil.createTextElement("p", Language.get("bbq.gui.FileUploader.uploading")), {className: "fileUploadWaitBox emptyfileUploadWaitBox"});
					this._filesUploadedDiv.appendChild(div);
					
					fileData.fileUploading = true;
					fileData.div = div;
					fileData.fileName = this._getFileName(assetLocation);
					
					// ensure uploadTo is properly formatted, otherwise form.submit won't work
					if(this.options.uploadTo.substring(0, 4) != "http") {
						this.options.uploadTo = window.location.protocol + "//" + window.location.host + (this.options.uploadTo.substring(0, 1) == "/" ? "" : "/") + this.options.uploadTo;
					}
					
					form.action = this.options.uploadTo;
					form.submit();
					
					Event.observe(fileData.iframe, "load", this._getUploadedData.bind(this, fileData));
					
					hasValidFiles = true;
				}
			}
		}
		
		if(hasValidFiles) {
			if(!this._addAnother) {
				this._uploadButton.setDisabled(true);
			}
			
			var headers = this._filesToUploadDiv.getElementsByTagName("h3");
			
			for(var i = 0, iCount=headers.length; i < iCount; i++) {
				headers[i].style.display = "none";
			}
			
			for(var i = 0, iCount=this._uploadingFileData.length; i < iCount; i++) {
				this._uploadingFileData[i].iframe.style.height = "0px";
			}
			
			this._maximiseThumbnailArea();
		}
	},
	
	/**
	 * @private
	 */
	_getFileName: function(assetLocation) {
		// \ for windows, / for everything else
		var fileLocation = assetLocation.split(assetLocation.search("/") ? "\\" : "/");
					
		var fileName = fileLocation[fileLocation.length - 1];
		return (fileName.length > 19 ? fileName.substr(0, 8) + "..." + fileName.substr(fileName.length - 8, 8) : fileName);
	},
	
	/**
	 * @private
	 */
	_minimiseThumbnailArea: function() {
		if(this._thumbnailDisplayMaximised) {
			this._thumbnailDisplayMaximised = false;
			this._uploadButton.setDisabled(false);
			Effect.BlindDown(this._filesToUploadDiv, {duration: 0.5, afterUpdate: this._resizeUploadedFilesArea.bind(this)});
		}
	},
	
	/**
	 * @private
	 */
	_maximiseThumbnailArea: function() {
		if(!this._thumbnailDisplayMaximised) {
			this._thumbnailDisplayMaximised = true;
			this._uploadButton.setDisabled(true);
			Effect.BlindUp(this._filesToUploadDiv, {duration: 0.5, afterUpdate: this._resizeUploadedFilesArea.bind(this)});
		}
	},
	
	/**
	 * @private
	 */
	_resizeUploadedFilesArea: function() {
		var newHeight = (this.options.multiple ? 358 : 298) - (this._filesToUploadDiv.style.height.replace("px", ""));
		this._filesUploadedDiv.style.height = newHeight + "px";
	},
	
	/**
	 * @private
	 */
	_updateNumFilesDisplay: function() {
		if(this._numFilesDisplay) {
				DOMUtil.emptyNode(this._numFilesDisplay);
				this._numFilesDisplay.appendChild(
					document.createTextNode(
						Language.getFormatted(this._uploadedFiles.length == 1 ? "bbq.gui.FileUploader.singleassetcount" : "bbq.gui.FileUploader.multipleassetcount", {
							count: this._uploadedFiles.length
						})
					)
				);
			}
	},
	
	/**
	 * Interrogates iFrames for uploaded file data.  Called via an onload event fired on the iFrame after form submission.
	 */
	_getUploadedData: function(fileData) {
		if(fileData.fileUploading) {
			if(fileData.iframe.contentWindow && fileData.iframe.contentWindow.getData) {
				var iframeWindow = fileData.iframe.contentWindow;
				
				if(iframeWindow.fileError) {
					this._fileUploadError(fileData.fileName, fileData.div);
				} else {
					this._fileUploaded(fileData, iframeWindow.getData());
				}
			} else {
				Log.dir(fileData.iframe);
			}
		}
	},
	
	_fileUploadError: function(fileName, outputDiv) {
		DOMUtil.emptyNode(outputDiv);
		DOMUtil.addClass(outputDiv, "uploadError");
		
		var deleteLink = new bbq.gui.button.DeleteButton({onclick: this._removeErrorFile.bind(this, outputDiv)});
		deleteLink.appendTo(outputDiv);
		
		outputDiv.appendChild(DOMUtil.createTextElement("p", "Error uploading " + fileName));
	},
	
	_removeErrorFile: function(element) {
		Effect.Fade(element, {duration: 0.25});
		
		if(this._uploadedFiles.length == 0) {
			this._addFile();
			this._minimiseThumbnailArea();
		}
	},
	
	/**
	 * @private
	 */
	_fileUploaded: function(fileData, passedData) {
		// remove old file name so that we can upload the same file twice
		var iFrameIndex = 0;
		
		Log.dir(passedData);
		
		DOMUtil.emptyNode(fileData.div);
		
		fileData.div.id = BBQUtil.generateGUID() + "_" + passedData.filetransferid;
		
		//this._filesToUploadDiv.removeChild(fileData.iframe);
		this._uploadTable.getElementsByTagName("tbody")[0].removeChild(fileData.row);
		
		var image = DOMUtil.createElement("img", {
			src: "/backend/uploads/getTemporaryThumbnail?id=" + passedData.filetransferid,
			style: {
				display: "none"
			}
		});
		
		fileData.div.appendChild(image);
		DOMUtil.removeClass(fileData.div, "emptyfileUploadWaitBox");
		
		var deleteLink = new bbq.gui.button.DeleteButton({onclick: this._removeUploadedFile.bind(this, fileData.div)});
		deleteLink.appendTo(fileData.div);
				
		fileData.div.appendChild(DOMUtil.createTextElement("p", [
			passedData.filesize,
			DOMUtil.createElement("br"),
			fileData.fileName
		]));
		
		image.onload = function() {
			if(image.width < 128) {
				image.style.marginLeft = Math.ceil((128 - image.width)/2) + "px";
			}
			
			if(image.height < 128) {
				var newMargin = Math.ceil((128 - image.height)/2) + "px";
				DOMUtil.setStyle(image, "marginTop", newMargin);
				DOMUtil.setStyle(image, "marginBottom", newMargin);
			}
		};
			
		this._uploadedFiles.push(passedData);
		
		this._updateNumFilesDisplay();
		
		Effect.Appear(image, {duration: 0.25});
	},
	
	/**
	 * @private
	 */
	_removeUploadedFile: function(element) {
		Effect.Fade(element, {duration: 0.25});
		
		// remove uploaded file data
		var keyToRemove = element.id.split("_")[1];
		
		for(var i = 0, iCount=this._uploadedFiles.length; i < iCount; i++) {
			if(this._uploadedFiles[i].filetransferid == keyToRemove) {
				this._uploadedFiles.splice(i, 1);
				break;
			}
		}
		
		this._updateNumFilesDisplay();
		
		if(this._uploadedFiles.length == 0) {
			this._addFile();
			this._minimiseThumbnailArea();
		}
		
		return false;
	},
	
	/**
	 * @private
	 */
	_cancelUpload: function() {
		if(this.willDelegateMethod("cancelUpload")) {
			return this.delegateMethod("cancelUpload");
		}
		
		currentPage.clearModalLayer();
		
		Event.stopObserving(document, "keypress", this._escapeKeyObserver);
	},
	
	/**
	 * @private
	 */
	_saveUpload: function() {
		if(this.willDelegateMethod("saveUpload")) {
			return this.delegateMethod("saveUpload");
		}
		
		currentPage.clearModalLayer();
		this.notifyListeners("onFilesUploaded");
	},
	
	/**
	 * @return {Array} uploaded files
	 */
	getFiles: function() {
		return this._uploadedFiles;
	}
});
