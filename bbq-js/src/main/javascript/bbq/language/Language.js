include(bbq.ajax.JSONRequest);
include(bbq.gui.GUIWidget);

/**
 * @class Language
 */
Language = {
	options: {},
	_language: {},
	_languageLoaded: false,
	
	/**
	 * @param {mixed} options
	 * @example
	 * options {
	 * 		section: string
	 * 		postLoad: function
	 * }
	 */
	load: function(options) {
		Language.options = options ? options : {};
		
		new bbq.ajax.JSONRequest({
			url: "/language/get",
			onSuccess: Language._gotLanguage.bind(Language), 
			args: (options && options.section ? {section: options.section} : null)});
	},
	
	/**
	 * @private
	 */
	_gotLanguage: function(serverResponse, language) {
		Language._language = language;
		Language._languageLoaded = true;
		
		if(Language.options.postLoad instanceof Function) {
			Language.options.postLoad.call(Language);
		}
	},
	
	get: function(string) {
		if(Language._language && Language._language[string]) {
			return Language._language[string];
		}
		
		Log.error("Could not find language key " + string);
		
		return "unknown";
	},

	/**
	 * Returns an array of language strings
	 * 
	 * @param	{String}	key
	 * @return	{Array}
	 */
	getArray: function(string) {
		if(!Language._language) {
			return [];
		}
		
		var output = [];
		
		for(var i = 0; true; i++) {
			var key = string + i;
			
			if(Object.isUndefined(Language._language[key])) {
				return output;
			}
			
			output.push(Language._language[key]);
		}
	},
	
	/**
	 * Allows for lanugage formatting so that variable value placement in strings is not dependant on the flow of the English language.
	 * 
	 * In the language file, declare this sort of thing:
	 *
	 * <code>
	 * <?xml version="1.0" encoding="utf-8"?>
	 * <!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
	 * <properties>
	 *      <entry key="generic.mystring">This string has {marker} marker</entry>
	 * </properties>
	 * </code>
	 * 
	 * Then in the javascript, call:
	 * 
	 * Language.getFormatted("generic.mystring", {marker: "a nice little"});
	 * 
	 * And the following will be output:
	 * 
	 * "This string has a nice little marker"
	 * 
	 * @param {Array} language
	 * @param {Object} keys
	 */
	getFormatted: function(language, keys) {
		var outputDomNode = false;

		for(var key in keys) {
			if(!Object.isString(keys[key]) && !Object.isNumber(keys[key])) {
				outputDomNode = true;
			}
		}

		if(outputDomNode) {
			return Language._getFormattedNode(language, keys);
		} else {
			return Language._getFormattedString(language, keys);
		}
	},

	_getFormattedString: function(language, keys) {
		var string = Language.get(language);

		try {
			for (var key in keys) {
				string = string.replace(new RegExp("\{" + key + "\}", "gi"), keys[key]);
			}
		} catch(e) {
			Log.error("Error formatting language string", e);
		}

		return string;
	},

	_getFormattedNode: function(language, keys) {
		var output = document.createDocumentFragment();
		var string = Language.get(language);

		try {
			for (var key in keys) {
				var index = string.indexOf("{" + key + "}");

				output.appendChild(document.createTextNode(string.substring(0, index)));

				if(Object.isString(keys[key])) {
					// String
					output.appendChild(document.createTextNode(keys[key]));
				} else if(keys[key] instanceof bbq.gui.GUIWidget) {
					// GUIWidget
					keys[key].appendTo(output);
				} else {
					// DOM node
					output.appendChild(keys[key]);
				}

				string = string.substring(index + ("{" + key + "}").length);
			}
		} catch(e) {
			Log.error("Error formatting language string", e);
		}

		return output;
	},

	isLoaded: function() {
		return Language._languageLoaded ? true : false;
	}
}
