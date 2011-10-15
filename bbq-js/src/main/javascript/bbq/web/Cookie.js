Cookie = {
	_keys: [
		"expires",
		"domain",
		"path",
		"secure"
	],
	
	set: function(key, value, expires, domain, path, secure) {
		if(!value) {
			// remove old cookie
			if(Cookie.get(key)) {
				Cookie.del(key);
			}
			
			return;
		}
		
		var args = {
			"expires": expires ? expires : new Date(new Date().getTime() + 2629743000),
			"domain": domain,
			"path": path,
			"secure": secure
		};
		
		var cookie = {
			value: value
		};
		
		Cookie._keys.each(function(arg) {
			Cookie._applyArg(cookie, arg, args[arg]);
		});
		
		document.cookie = Cookie._toString(key, cookie);
	},
	
	_applyArg: function(cookie, key, value) {
		if(value) {
			cookie[key] = value;
		}
	},
	
	get: function(cookieName) {
		var cookie = Cookie._getAll()[cookieName];
		
		if(cookie != null) {
			return cookie.value;
		}
		
		return null;
	},
	
	del: function(cookieName) {
		var cookies = Cookie._getAll();
		
		if(cookies[cookieName]) {
			cookies[cookieName].expires = new Date(new Date().getTime() - 1000000);
			document.cookie = Cookie._toString(cookieName, cookies[cookieName]);
		}
	},
	
	_getAll: function() {
		var output = {};
		
		var parts = document.cookie.split("; ");
		var currentName;
		
		for(var i = 0; i < parts.length; i++) {
			var keyPart = parts[i];
			
			if(keyPart && keyPart.strip) {
				
				var keyValue = keyPart.strip().split("=");
				
				if(keyValue[0] == "expires") {
					output[currentName].expires = new Date(keyValue[1]);
				} else if(keyValue[0] == "path") {
					output[currentName].path = keyValue[1];
				} else if(keyValue[0] == "domain") {
					output[currentName].domain = keyValue[1];
				} else if(keyValue[0] == "secure") {
					output[currentName].secure = true;
				} else {
					currentName = keyValue[0];
					output[currentName] = {
						value: keyValue[1]
					};
				}
			}
		}
		
		return output;
	},
	
	_toString: function(cookieName, object) {
		var cookie = [
			cookieName + "=" + escape(object.value)
		];
		
		Cookie._keys.each(function(arg) {
			if(object[arg]) {
				if(arg == "expires") {
					cookie.push(arg + "=" + object[arg].toUTCString());
				} else if(arg == "secure") {
					cookie.push(arg);
				} else {
					cookie.push(arg + "=" + object[arg]);
				}
			}
		});
		
		return cookie.join("; ");
	}
}