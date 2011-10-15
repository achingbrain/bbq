include(bbq.gui.GUIWidget);

/**
 * @class bbq.gui.FileUploadWidget
 * @extends bbq.gui.GUIWidget
 */
bbq.gui.FileUploadWidget = new Class.create(bbq.gui.GUIWidget, {
	
	_iFrame: null,
	_uploadInterval: null,
	_uploadData: null,
	
	/**
	 * Supoprts the following options:
	 * 
	 * options: {
	 * 		uploadTo: String		// Where to upload the file to
	 * 		extensions: Array		// Optional - an array of allowed file extensions
	 * }
	 * 
	 * Supports the following callbacks:
	 * 
	 * onUploadError
	 * onUploadComplete
	 * onInvalidFileExtension
	 */
	initialize: function($super, options) {
		$super(options);
		
		this.setRootNode("div");
		this.addClass("FileUploadWidget");
		
		var input = DOMUtil.createElement("input", {type: "file", name: "assetFile"});
		var form = DOMUtil.createTextElement("form", input, {method: "post", enctype: "multipart/form-data"});
		DOMUtil.setStyle(form, "width", "100%");
		
		this._iFrame = DOMUtil.createElement("iframe");
		
		Event.observe(this._iFrame, "load", function() {
			var iframeDoc = DOMUtil.getIFrameDocument(this._iFrame);
			iframeDoc.body.appendChild(form);
			iframeDoc.body.style.margin = "0";
			iframeDoc.body.style.padding = "0 10px";
		}.bind(this));
		
		Event.observe(input, "change", function() {
			this.notifyListeners("onFileChosen");
		}.bind(this));
		
		this.appendChild(this._iFrame);
	},
	
	appendBefore: function(parentNode, beforeNode) {
		parentNode.insertBefore(this.getRootNode(), beforeNode);
	},

	beginUpload: function() {
		if(!this._uploadInterval) {
			var form = DOMUtil.getIFrameDocument(this._iFrame).forms[0];
			
			if(form && form.assetFile) {
				var fileLocation = form.assetFile.value;
				
				if(fileLocation) {
									
					var extension = fileLocation.split(".").pop().toLowerCase();
					Log.info(extension);
					if(this.options.extensions instanceof Array && this.options.extensions.indexOf(extension) == -1) {
						this.notifyListeners("onInvalidFileExtension");
						return;
					}
					
					form.action = this.options.uploadTo;
					
					if(form.action.substring(0, 1) == "/") {
						// prepend http(s)://domain
						form.action = document.location.protocol + "//" + document.location.host  + form.action;
					}
					
					Log.info("uploading to " + form.action);
					
					form.submit();
					
					this._uploadInterval = setInterval(this._getUploadData.bind(this), 2000);
				}
			}
		}
	},
	
	cancelUpload: function() {
		clearInterval(this._uploadInterval);
	},
	
	_getUploadData: function() {
		if(this._iFrame.contentWindow && this._iFrame.contentWindow.getData) {
			clearInterval(this._uploadInterval);
			var iframeWindow = this._iFrame.contentWindow;
			
			this._uploadData = iframeWindow.getData();
			
			if(iframeWindow.fileError) {
				this.notifyListeners("onUploadError");
			} else {
				this.notifyListeners("onUploadComplete");
			}
		}
	},
	
	getUploadData: function() {
		return this._uploadData;
	},
	
	getUploadError: function() {
		return this._uploadData;
	},
	
	getFileTransferID: function() {
		var data = this.getUploadData();
		return data["filetransferid"];
	}
});
