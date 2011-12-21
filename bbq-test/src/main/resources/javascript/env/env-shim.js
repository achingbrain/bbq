if(!window["console"]) {
	window["console"] = {

	};
}

if(!window.console["log"]) {
	// shim in Java system.out for logging
	window.console.log = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!window.console["debug"]) {
	// shim in Java system.out for logging
	window.console.debug = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!window.console["info"]) {
	// shim in Java system.out for logging
	window.console.info = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!window.console["warn"]) {
	// shim in Java system.out for logging
	window.console.warn = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!window.console["error"]) {
	// shim in Java system.out for logging
	window.console.error = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!window["print"]) {
	// shim in Java system.out for logging
	window.print = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!window["include"]) {
	include = function(obj) {
		
	}
}
