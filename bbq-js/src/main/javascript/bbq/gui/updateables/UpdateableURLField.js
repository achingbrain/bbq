include(bbq.gui.updateables.UpdateableTextField);

/**
 * @class bbq.gui.updateables.UpdateableURLField
 * @extends behaviour.gui.updateables.UpdateableTextField 
 */
behaviour.gui.updateables.UpdateableURLField = new Class.create(behaviour.gui.updateables.UpdateableTextField, {
	
	/**
	 * A text field containing a URL
	 * @param {Object} options
	 */
	initialize: function($super, options) {
		if(!options.initialValue) {
			options.initialValue = "http://";
		}
		
		$super(options);
		
		this.addClass("UpdateableURLField");
		
		this.registerListener("onValueChanged", this._showIsSecure.bind(this));
	},
	
	/**
	 * Creates a view field
	 */
	createViewField: function() {
		this.empty();
		
		if(this.displayValue && this.displayValue.length > 0) {
			if(this.getProtocol()) {
				this.appendChild(DOMUtil.createTextElement("a", this._getTruncatedValue(), {href: this.currentValue, target: "new"}));
			} else {
				this.appendChild(document.createTextNode(this._getTruncatedValue()));
			}
		} else {
			this.appendChild(document.createTextNode(" "));
		}
	},
	
	/**
	 * Returns current value
	 */
	getValue: function() {
		if(this.currentValue == "http://" || this.currentValue == "https://") {
			this.currentValue = "";
		}
		
		return behaviour.gui.updateables.UpdateableTextField.prototype.getValue.apply(this, arguments);
	},
	
	_showIsSecure: function() {
		try {
			this.removeClass("UpdateableURLField_FieldIsSecure");
			
			if(this.getProtocol() == "https" || this.getProtocol() == "ssl" || this.getProtocol() == "ssh" || this.getProtocol() == "sftp") {
				this.addClass("UpdateableURLField_FieldIsSecure");
			}
		} catch(e) {
			Log.warn(e);
		}
	},
	
	_getParts: function() {
		// handles urls of the type http://user:password@domain.com/some/path
		
		var value = this.currentValue.strip().toLowerCase();
		
		var parts = {};
		
		// gets protocol
		if(value.search("://")) {
			var tmpArray = value.split("://");
			parts.protocol = tmpArray[0];
			value = tmpArray[1];
		}
		
		// gets path
		if(value.search("/")) {
			var tmpArray = value.split("/", 1);
			parts.path = tmpArray[1];
			value = tmpArray[0];
		}
		
		// gets username and password
		if(value.search("@")) {
			var tmpArray = value.split("@");
			parts.domain = tmpArray[1];
			tmpArray = tmpArray[0].split(":");
			parts.username = tmpArray[0];
			parts.password = tmpArray[1];
		} else {
			parts.domain = value;
		}
		
		// gets port number
		if(typeof(parts.domain) != "undefined" && parts.domain.search(":")) {
			var tmpArray = parts.domain.split(":");
			parts.domain = tmpArray[0];
			parts.port = tmpArray[1];
		}
		
		return parts;
	},
	
	getProtocol: function() {
		return this._getParts()["protocol"];
	},
	
	getPath: function() {
		return this._getParts()["path"];
	},
	
	getDomain: function() {
		return this._getParts()["domain"];
	},
	
	getPort: function() {
		return this._getParts()["port"];
	},
	
	getUsername: function() {
		return this._getParts()["username"];
	},
	
	getPassword: function() {
		return this._getParts()["password"];
	}
});
