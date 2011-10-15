include(bbq.lang.TreeWalker);

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
			return new Date(data[1]);
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
	}
}
