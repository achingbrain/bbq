/**
 * Provides some utility methods for Javascript vagaries
 * @class BBQUtil
 */
BBQUtil = {
	/**
	 * @return {Object} returns window size object
	 */
	getWindowSize: function() {
		var screenSize = {};
		
		if(Browser.InternetExplorer === true) {
			screenSize.width = document.documentElement.offsetWidth;
			screenSize.height = document.documentElement.offsetHeight;
		} else {
			screenSize.width = window.innerWidth;
			screenSize.height = window.innerHeight;
		}
		
		return screenSize;
	},
	/**
	 * @return {Object} returns viewport size object
	 */
	getViewportSize: function() {
		var viewPortSize = {};
 		
		 if (typeof window.innerWidth != 'undefined') {
			viewPortSize.width = window.innerWidth,
			viewPortSize.height = window.innerHeight
		} else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
			viewPortSize.width = document.documentElement.clientWidth;
			viewPortSize.height = document.documentElement.clientHeight;
		} else {
			viewPortSize.width = document.getElementsByTagName('body')[0].clientWidth;
			viewPortSize.height = document.getElementsByTagName('body')[0].clientHeight;
 		}
		
		return viewPortSize;
	},

/**
 * Counts the number of properties an object has
 * 
 * @return	{integer}
 */
	count: function(object) {
		var i = 0;
		
		for(var key in object) {
			i++;
		}
		
		return i;
	},

/**
 * Recursively dumps the name and value of each property contained within the passed object
 * 
 * @param {Object} object
 * @param {string} spaces
 */
	dumpObject: function(object, spaces) {
		if(!spaces) {
			spaces = "";
		}
		
		for(var key in object) {
			if(object[key] instanceof Object) {
				Log.info(spaces + key + " >");
				BBQUtil.dumpObject(object[key], spaces + " ");
			} else {
				Log.info(spaces + key + " = " + object[key]);
			}
		}
	},

/**
 * Turns an object into an array - eg. an associative array into a numeric array
 * 
 * @param	{Object}	object
 * @return	{Array}
 */
	objectToArray: function(object) {
		if(object instanceof Array) {
			return object;
		}
		
		var array = [];
		
		for(var key in object) {
			array[array.length] = object[key];
		}
		
		return array;
	},

/**
 * Returns a discrete copy of the passed object
 * 
 * @param	{Object}	object
 * @return	{Object}
 */
	cloneObject: function(object) {
		if(object) {
			var objectClone = new object.constructor();
			
			for(var property in object) {
				if(property != "controller" && property != "currentPage") {
					if(typeof object[property] == 'object') {
						objectClone[property] = BBQUtil.cloneObject(object[property]);
					} else {
						objectClone[property] = object[property];
					}
				}
			}
		
		return objectClone;
		}
	},

/**
 * Removes leading and trailing spaces from the passed string
 * 
 * @param	{String}	string
 * @return	{String}
 */
	trim: function(string) {
		return string.replace(/^\s*|\s*$/g,"");
	},

/**
 * Tries to remove focus from the element that triggered the passed event and then return that element.
 * 
 * N.B.  This method occasionally makes FireFox throw an uncatchable exception
 * 
 * @param	{Event}	event
 * @param	{Node}	element
 */
	clearFocus: function(event) {
		if(event) {
			var element = Event.element(event);
			
			if(element) {
				try {
					element.blur();
				} catch(e) {
					Log.warn("Blurred non-focused element " + e);
				}
				
			return element;
			}
		}
	},

/**
 * Serializes an array in a fashion suitable for unserialization within a PHP script
 * 
 * @param	{Array}	passedArray
 * @return	{String}
 */
	serializeForPHP: function(passedArray)	{
		var output = "";
		var index = 0;
		for (var key in passedArray)	{
			index++;
			output += "s:" + String(key).length + ":\"" + String(key) + "\";s:" + String(passedArray[key]).length + ":\"" + String(passedArray[key]) + "\";";
		}
		
		output = "a:" + index + ":{" + output + "}";
		return output;
	},
	/**
	 * @param {string} cookieName
	 */
	readCookie: function(cookieName) {
		cookieName += "=";
		var ca = document.cookie.split(';');
	    
	    for(var i=0;i < ca.length;i++)
	    	{
	        var c = ca[i];
	        // Move past leading whitespace
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(cookieName) == 0) return c.substring(cookieName.length,c.length);
	    	}
	    
	    return null;
	}, 
	
	/**
	 * @return {string} Returns string representaton of a GUID
	 */
	generateGUID:  function() {
	    var g = "";
	    
	    for(var i = 0; i < 32; i++) {
	    	g += Math.floor(Math.random() * 0xF).toString(0xF) + (i == 8 || i == 12 || i == 16 || i == 20 ? "-" : "");
	    }
	    
	    return g;
	},
	/**
	 * @param {string} guid
	 * @return {boolean}
	 */
	isGUID: function(guid) {
		if(!guid) {
			return false;
		}
		
		if(!guid.toLowerCase) {
			return false;
		}
		
		guid = guid.toLowerCase();
		
		if(guid.length != 36) {
			return false;
		}
		
		for(var i = 0; i < 36; i++) {
			if(i == 8 || i == 13 || i == 18 || i == 23) {
				if(guid.charAt(i) != '-') {
					return false;
				}
			} else if(!guid.charAt(i).match(/[0-9|a-f]/i)) {
				return false;
			}
		}
		
		return true;
	},
	/**
	 * @param {string} text
	 * @param {string} attributes
	 * @return {Node}
	 */
	formatText: function(text, attributes) {
		var output = DOMUtil.createElement("p", attributes);
				
		var lines = text.strip().split(/\n/);
		
		var linkRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		
		// go through line by line
		for(var i = 0; i < lines.length; i++) {
			var words = lines[i].strip().split(" ");
			
			for(var n = 0; n < words.length; n++) {
				// search for URLy text
				if(words[n].match(linkRegex)) {
					output.appendChild(DOMUtil.createTextElement("a", words[n], {href: words[n], target: "_new"}));
				} else {
					output.appendChild(document.createTextNode(words[n]));
				}
				
				// more words to go, append a space
				if(n < words.length - 1) {
					output.appendChild(document.createTextNode(" "));
				}
			}
			
			// more lines to go, append a line break
			if(i < lines.length - 1) {
				output.appendChild(document.createElement("br"));
			}
		}
		
		return output;
	},
	
	shorten: function(text, maxLength) {
		var output = text.strip();
		
		if(output.length <= maxLength) {
			return output;
		}
		
		var segmentLength = Math.floor((maxLength + 3)/2);
		
		return output.substring(0, segmentLength).strip() + "..." + output.substring(output.length - segmentLength).strip();
	},
	
	getKey: function(entity, property) {
		if(typeof(property) != "undefined" && typeof(entity[property]) != "undefined") {
			if(entity[property] instanceof Function) {
				return entity[property]();
			}
			
			return entity[property];
		}
		
		if(typeof(entity["id"]) != "undefined") {
			return entity["id"];
		}
		
		// have we been given a GUID?
		if(BBQUtil.isGUID(entity)) {
			return entity;
		}
		
		// try other default
		if(entity.getId instanceof Function) {
			return entity.getId();
		}
	},
	
	capitalize: function(string) {
		if(string) {
			return string.substring(0, 1).toUpperCase() + string.substring(1);
		}
	},
	
	urlDecode: function(string) {
		var histogram = {};
		var replacer = function(search, replace, str) {
		var tmp_arr = [];
			tmp_arr = str.split(search);
			return tmp_arr.join(replace);
		};
    	
    	// The histogram is identical to the one in urlencode.
		histogram["'"]   = '%27';
		histogram['(']   = '%28';
		histogram[')']   = '%29';
		histogram['*']   = '%2A';
		histogram['~']   = '%7E';
		histogram['!']   = '%21';
		histogram['%20'] = '+';
		
		for (replace in histogram) {
			search = histogram[replace]; // Switch order when decoding
			string = replacer(search, replace, string) // Custom replace. No regexing   
		}
		
		// End with decodeURIComponent, which most resembles PHP's encoding functions
		string = decodeURIComponent(string);
 		return string;
	},
	
	getRoundedDate: function() {
		var date = new Date();
	
		if(date.getMinutes() < 15) {
			date.setMinutes(0, 0);
		} else if(date.getMinutes() < 30) {
			date.setMinutes(15, 0);
		} else if(date.getMinutes() < 45) {
			date.setMinutes(30, 0);
		} else {
			date.setMinutes(45, 0);
		}
		
		return date;
	},
	
	isValidEmail: function(email) {
		if(!email) {
			return false;
		}

		email = email.strip();
		
		return email != "" && email.match(/@/);
	},
	
	/**
	 * Will format 1024B into 1KB, 1024KB into 1MB, etc
	 * 
	 * @param {Integer} The number of bytes to format
	 * 
	 * @return {String}
	 */
	formatFileSize: function(bytes) {
		if(bytes < Math.pow(2,10)) {
			return bytes + 'B';
		}else if(bytes >= Math.pow(2,10) && bytes < Math.pow(2,20)) {
			return (Math.round(bytes/Math.pow(2,10))) + 'KB';
		}else if(bytes >= Math.pow(2,20) && bytes < Math.pow(2,30)) {
			return  (Math.round(bytes/Math.pow(2,20))) + 'MB';
		}else if(bytes >= Math.pow(2,30) && bytes < Math.pow(2,40)) {
			return  (Math.round(bytes/Math.pow(2,30))) + 'GB';
		}else if(bytes >= Math.pow(2,40)) {
			return  (Math.round(bytes/Math.pow(2,40))) + 'TB';
		}
	},

	findClassName: function(parent, child, path) {
		for (var key in parent) {
			// ignore anything that will cause an infinite loop or security error
			if (parent[key] == parent || key == "history" || key == "globalStorage" || key == "argumentNames") {
				continue;
			}

			var firstCharacter = key.substring(0, 1);

			// first character is upper case, we have a class
			if (firstCharacter == firstCharacter.toUpperCase()) {
				try {
					if (child instanceof parent[key]) {
						return path + "." + key;
					}
				} catch(e) {
					// instanceof operator is a bit picky about it's operands
				}
			} else {
				// key is not a class name so continue walking the tree
				var matches = BBQUtil.findClassName(parent[key], child, path + "." + key);

				if (matches) {
					return matches;
				}
			}
		}
	},

	findClass: function(string) {
		var parts = string.split(".");
		var parent = window;

		for(var i = 0; i < parts.length; i++) {
			if(i == (parts.length -1)) {
				return parent[parts[i]];
			} else {
				parent = parent[parts[i]];
			}
		}
	}
}
