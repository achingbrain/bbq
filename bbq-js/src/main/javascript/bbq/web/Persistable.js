include(bbq.util.BBQUtil);

/**
 * Holds details about individual servers
 */
bbq.web.Persistable = new Class.create({
	_getArgs: function() {
		return null;
	},

	_getClass: function() {
		for(var i = 0; i < bbq.web.Persistable.typeHints.length; i++) {
			var hint = bbq.web.Persistable.typeHints[i];
			var clazz = BBQUtil.findClassName(window[hint], this, hint);

			if(clazz) {
				return clazz;
			}
		}
	},

	toJSON: function() {
		return {
			__jsonclass__: [
				this._getClass(),
				this._getArgs()
			]
		}
	}
});

bbq.web.Persistable.typeHints = ["bbq"];
