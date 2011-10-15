if(!this["print"]) {
	// shim in Java system.out for logging
	print = function(message) {
		java.lang.System.out.println("[TEST] " + message);
	}
}

if(!this["include"]) {
	include = function(obj) {
		
	}
}