/**
 * Log utility object
 *
 * @class Log
 */
var Log = {
	debugging: $$("html")[0].hasClassName("debug"),

	_logIt: function(message, type, nodate, exception) {
		if(!Log.debugging) {
			return;
		}

		if(!nodate) {
			var date = new Date();
			message = Log._padNumber(date.getHours()) + ":" + Log._padNumber(date.getMinutes()) + ":" + Log._padNumber(date.getSeconds()) + " - " + message;
		}

		if(window.console) {
			if(window.console[type]) {
				console[type](message);
			} else if(window.console.log) {
				console.log(message);
			}
		}

		if(exception) {
			Log._logIt(exception, "dir", true);
		}
	},

	debug: function(message, exception) {
		Log._logIt(message, "debug", false, exception);
	},

	info: function(message, exception) {
		Log._logIt(message, "info", false, exception);
	},

	warn: function(message, exception) {
		Log._logIt(message, "warn", false, exception);
	},

	error: function(message, exception) {
		Log._logIt(message, "error", false, exception);
	},

	dir: function(object) {
		Log._logIt(object, "dir", true);
	},

	_padNumber: function(number) {
		if(number < 10) {
			number = "0" + number;
		}

		return number;
	}
}
