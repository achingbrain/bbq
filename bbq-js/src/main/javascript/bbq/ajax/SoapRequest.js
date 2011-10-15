include(bbq.ajax.AJAXRequest);
include(bbq.gui.error.ServerError);

/**
 * @class bbq.ajax.SoapRequest
 * @extends bbq.ajax.AJAXRequest
 */
bbq.ajax.SoapRequest = Class.create(bbq.ajax.AJAXRequest, {
	initialize: function($super, options) {
		options.method = "POST";
		options.contentType = "application/soap+xml";
		
		$super(options);
	},
	
	_createRequestHeaders: function() {
		return {
			"SoapAction": this.options.action,
			"Content-Type": "application/soap+xml"
		};
	},
	
	_getPostBody: function() {
		var header = "";
		
		if(this.options.authentication) {
			header = "<soapenv:Header xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" + 
							"<wsse:Security soapenv:mustUnderstand=\"true\">" + 
								this.options.authentication.getSecurityHeader() + 
							"</wsse:Security>" +
						"</soapenv:Header>";
		}
		
		return "<?xml version='1.0' encoding='UTF-8'?>" + 
			"<soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope'>" +
				header +  
				"<soapenv:Body>" + 
					"<" + this.options.action + "Request xmlns=\"" + this.options.namespace +"\">" + 
						this._parseMessageBody(null, this.options.message) +
					"</" + this.options.action + "Request>" + 
				"</soapenv:Body>" + 
			"</soapenv:Envelope>\r\n";
	},
	
	_parseMessageBody: function(key, message) {
		if(message == null) {
			return "";
		}
		
		if(Object.isNumber(message) || Object.isString(message)) {
			return message;
		}
		
		var output = "";
		
		if(Object.isArray(message)) {
			message.each(function(value) {
				if(value == null) {
					return;
				}
				
				output += "<" + key + ">" + this._parseMessageBody(key, message[key]) + "</" + key + ">";
			});
		} else {
			for(var key in message) {
				if(message[key] == null) {
					continue;
				}
				
				output += "<" + key + ">" + this._parseMessageBody(key, message[key]) + "</" + key + ">";
			}
		}
		
		return output;
	},
	
	/**
	 * @param	{String}		handlerName
	 * @param	{Object}		args
	 */
	_callHandler: function($super, handlerName, args) {
		var serverResponse = args[0];
		var response;
		
		try {
			var doc = serverResponse.responseXML.documentElement;
			var responseElement = doc.getElementsByTagName(this.options.action + "Response")[0];
			
			response = this._parse(responseElement);
			
		} catch(e) {
			Log.error("Could not call handler " + handlerName, e);
			
			var errorMessage = new bbq.gui.error.ServerError({
				url: this.options.url,
				args: this.options.args,
				serverResponse: serverResponse.responseText
			});
			errorMessage.appear();
		}
		
		$super(handlerName, [serverResponse, response]);
	},
	
	_parse: function(node) {
		//Log.info("parsing " + node.nodeName);
		
		// are we parsing multiple sibling nodes with the same name?
		// if so, store them in an array
		var nodeName;
		var isArray;
		
		$A(node.childNodes).each(function(childNode) {
			if(childNode.nodeName == nodeName) {
				isArray = true;
				
				throw $break;
			}
			
			nodeName = childNode.nodeName; 
		});
		
		// will be returned
		var response;
		
		if(isArray) {
			response = [];
			
			$A(node.childNodes).each(function(childNode) {
				if(childNode.nodeName == "#text") {
					// found text node, abort!
					response = this._parseText(childNode.nodeValue);
					
					throw $break;
				}
				
				response.push(this._parse(childNode));
			}.bind(this));
		} else {
			response = {};
			
			$A(node.childNodes).each(function(childNode) {
				if(childNode.nodeName == "#text") {
					// found text node, abort!
					response = this._parseText(childNode.nodeValue);
					
					throw $break;
				}
				
				response[childNode.nodeName] = this._parse(childNode);
			}.bind(this));
		}
		
		return response;
	},
	
	_parseText: function(value) {
		// try as an integer
		var asInt = parseInt(value);
		
		// if not not-a-number and the string value is the same as the int value
		if(!isNaN(asInt) && "" + asInt == value) {
			return asInt;
		}
		
		// try as a float
		var asFloat = parseFloat(value);
		
		// if not not-a-number and the string value is the same as the float value
		if(!isNaN(asFloat) && "" + asFloat == value) {
			return asFloat;
		}
		
		// is it a date?
		if(value.charAt(4) == "-" && value.charAt(7) == "-" && value.charAt(10) == "T"
			&& value.charAt(13) == ":" && value.charAt(16) == ":") {
			return new Date(value);
		}
		
		return value;
	}
});
