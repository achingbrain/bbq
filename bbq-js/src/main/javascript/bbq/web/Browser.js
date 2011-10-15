include(bbq.web.DOMUtil);

/**
 * @class Browser
 * @constructor
 */
Browser = {
	InternetExplorer: false,
	Opera: false,
	Safari: false,
	Chrome: false,
	Mozilla: false,
	Ajax: false,
	DOM: false,
	Flash: false,
	version: 0,
	forms: {},
	
	/** find out which broswer we are running */
	detect: function() {
		
		if(window.opera) {
			Browser.Opera = true;
			
			if(window.XMLHttpRequest) {
				Browser.version = 8;
			} else if(document.getElementById) {
				Browser.version = 7;
			}
		} else if((document.childNodes) && (!document.all) && (!navigator.taintEnabled) && (!navigator.accentColorName)) {
			if(window.chrome) {
				Browser.Chrome = true;
			} else {
				Browser.Safari = true;

				if(window.devicePixelRatio) {
					Browser.version = 3;
				} else {
					Browser.version = 2; // probably
				}
			}
		} else if(document.getElementById && !document.all) {
			Browser.Mozilla = true;
			
			if(navigator.registerProtocolHandler) {
				Browser.version = 3;
			} else if(window.Iterator) {
				Browser.version = 2;
			} else if(Array.every) {
				Browser.version = 1.5;
			} else if(window.getComputedStyle) {
				Browser.version = 1;
			}
		} else if(document.getElementById && document.all && window.ActiveXObject) {
			Browser.InternetExplorer = true;
			
			if(document.querySelectorAll) {
				Browser.version = 8;
			} else if(window.XMLHttpRequest) {
				Browser.version = 7;
			} else if(document.compatMode && document.all) {
				Browser.version = 6;
			} else if(window.createPopup) {
				Browser.version = 5.5;
			} else if(window.attachEvent) {
				Browser.version = 5;
			} else if(document.all) {
				Browser.version = 4;
			}
		}
		
		// does it support AJAX?
		if(window.XMLHttpRequest) {
			Browser.Ajax = true;
		} else if(window.ActiveXObject) {
			try {
				requestObject=new ActiveXObject("Msxml2.XMLHTTP");
				this.Ajax = true;
			} catch (e) {
				try {
					requestObject=new ActiveXObject("Microsoft.XMLHTTP");
					Browser.Ajax = true;
				} catch (oc) {}
			}
		}
		
		// how about the DOM?
		if(document.getElementById) {
			Browser.DOM = true;
		}
		
		// and Flash?
		if(Browser.InternetExplorer) {
			var obj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			
			if(!obj.activeXError) {
				Browser.Flash = true;
			}
		} else {
			try {
				if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
					Browser.Flash = true;
				}
			} catch(e) {
				if (navigator.mimeTypes ['application/x-shockwave-flash'] != undefined) {
					Browser.Flash = true;
				}
			}
		}

		DOMUtil.addClass($$("html")[0], Browser.getBrowserName());

		// form support
		var input = document.createElement("input");
		Browser.forms.placeholderText = ("placeholder" in input);

		// check HTML5 input type support
		Browser.forms.types = {};

		["search", "tel", "url", "email", "datetime", "date", "month", "week", "time", "datetime-local", "number", "color", "range"].each(function(type) {
			input.setAttribute("type", type);

			Browser.forms.types[type] = (input.type == type);
		});
	},
	/** get the browser name */
	getBrowserName: function() {
		if(Browser.InternetExplorer) {
			return "InternetExplorer";
		} else if(Browser.Opera) {
			return "Opera";
		} else if(Browser.Safari) {
			return "Safari";
		} else if(Browser.Mozilla) {
			return "Mozilla";
		} else if(Browser.Chrome) {
			return "Chrome";
		}
		
		return "No idea";
	}
}

Browser.detect();
