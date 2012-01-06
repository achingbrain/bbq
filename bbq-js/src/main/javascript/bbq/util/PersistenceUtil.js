include(bbq.lang.TreeWalker);

/**
 * @class PersistenceUtil
 */
PersistenceUtil = {
	serialize: function(object) {
		new bbq.lang.TreeWalker({
			target: object,
			callback: function(arg) {
				if(arg == null) {
					return null;
				}

				if(arg instanceof Date) {
					this._serializeDate(arg);
				}

				return arg;
			}.bind(this)
		});

		return Object.toJSON(object);
	},

	_serializeDate: function(date) {
		return ["datetime", date.toUTCString()];
	},

	deserialize: function(string) {
		var object = string;

		if(string && string.evalJSON) {
			object = string.evalJSON(true);
		}

		if(object["__jsonclass__"]) {
			object = this._recreateObject(object);
		}

		new bbq.lang.TreeWalker({
			target: object,
			callback: function(arg) {
				if (arg == null) {
					return null;
				}

				if(arg["__jsonclass__"]) {
					return this._recreateObject(arg);
				}

				return arg;
			}.bind(this)
		});

		return object;
	},

	_recreateObject: function(data) {
		data = data["__jsonclass__"];

		if (data[0] == "datetime") {
			return this._parseDate(data[1]);
		} else if (data[0] == "binary") {
			return atob(data[1]);
		} else if (data[0].indexOf(".") != -1) {
			// deserialize bbq.web.Persistable
			var className = data[0].split(".");
			var holder = window;

			for(var i = 0; i < className.length; i++) {
				if(i == (className.length - 1)) {
					if(!Object.isUndefined(holder[className[i]])) {
						return new holder[className[i]](data[1]);
					}
				} else if(!Object.isUndefined(holder[className[i]])) {
					holder = holder[className[i]];
				} else {
					break;
				}
			}

		} else {
			Log.warn("Unknown __jsonclass__ type: " + data[0]);
		}

		return null;
	},

	// deals with inconsistent ISO 8601 date processing
	//  Thank you Zetafleet http://zetafleet.com/blog/javascript-dateparse-for-iso-8601
	_parseDate: function(dateString) {
		var timestamp, struct, minutesOffset = 0;
		var numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];

		// ES5 15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
		// before falling back to any implementation-specific date parsing, so that’s what we do, even if native
		// implementations could be faster
		//              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
		if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(dateString))) {
			// avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
			for (var i = 0, k; (k = numericKeys[i]); ++i) {
				struct[k] = +struct[k] || 0;
			}

			// allow undefined days and months
			struct[2] = (+struct[2] || 1) - 1;
			struct[3] = +struct[3] || 1;

			if (struct[8] !== 'Z' && struct[9] !== undefined) {
				minutesOffset = struct[10] * 60 + struct[11];

				if (struct[9] === '+') {
					minutesOffset = 0 - minutesOffset;
				}
			}

			timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
		}
		else {
			timestamp =Date.parse(dateString);
		}

		if(!isNaN(timestamp)) {
			return new Date(timestamp);
		}

		return timestamp;
	}
}
