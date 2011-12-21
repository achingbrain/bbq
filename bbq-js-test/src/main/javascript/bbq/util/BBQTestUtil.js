if(Log) {
	Log.debugging = true;
}

var BBQTestUtil = {

	_Log_logIt: null,
	_Language_get: null,
	_Language_getArray: null,
	_Language_getFormatted: null,

	/**
	 * I redirect Log messages to the runner's console output
	 */
	redirectLog: function(runner) {

		if(!Log) {
			runner.error('Requested Log redirect but no components using Log functionality');
			return;
		}

		this._Log_logIt = Log._logIt;

		Log._logIt = function(message, type, nodate, exception) {
			if(!nodate) {
				var date = new Date();
				message = Log._padNumber(date.getHours()) + ":" + Log._padNumber(date.getMinutes()) + ":" + Log._padNumber(date.getSeconds()) + " - " + message;
			}

			if(type == 'error') {
				runner.error(type + ": " + message);
			} else {
				runner.info(type + ": " + message);
			}

			if(exception) {
				runner.error(exception);
			}
		};
	},

	restoreLog: function() {
		if(!Log) return;
		Log._logIt = this._Log_logIt;
	},

	/**
	 * The JSON request for language files does not work while testing (language server not running), therefore requests
	 * for language will fail with an error. This function mocks requests for localization with functions that simply
	 * echo the arguments given to them.
	 */
	mockLanguage: function() {

		if(!Language) {
			if(Log) Log.error('Requested Language mock but no components using Language functionality');
			return;
		}

		this._Language_get = Language.get;
		this._Language_getArray = Language.getArray;
		this._Language_getFormatted = Language.getFormatted;

		Language.get = function(key){return key;};
		Language.getArray = function(string){return [string];};
		Language.getFormatted = function(language, keys){return language;};
	},

	restoreLanguage: function() {
		if(!Language) return;
		Language.get = this._Language_get;
		Language.getArray = this._Language_getArray;
		Language.getFormatted = this._Language_getFormatted;
	}
};
