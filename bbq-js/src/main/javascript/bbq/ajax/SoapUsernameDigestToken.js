
bbq.ajax.SoapUsernameDigestToken = Class.create(/** @lends bbq.ajax.SoapUsernameDigestToken.prototype */ {
	_options: null,

	/**
	 * <p>Allows for sending a UsernameDigest authentication token with a SOAP request.</p>
	 *
	 * <p>Instances of this class are intended to be passed as the "authentcation" property
	 * of the options object for instances of bbq.ajax.SoapRequest.</p>
	 *
	 * @example
	 * <pre><code class="language-javascript">
	 * var token = new bbq.ajax.SoapUsernameDigestToken({
	 *     username: "foo",
	 *     password: "bar"
	 * });
	 * </code></pre>
	 * @constructs
	 * @param {Object} options
	 * @see bbq.ajax.SoapRequest
	 */
	initialize: function(options) {
		this._options = options;
	},

	getSecurityHeader: function() {
		var created = new Date();
		var nonce = String(created.getTime()).replace(/\D/gi,'');
		var digest = nonce + created + this._options.password;
		digest = Crypto.SHA1.b64_sha1(digest);
		nonce = Crypto.rstr2b64(nonce);

		return "<wsse:UsernameToken>" + 
						"<wsse:Username>" + this._options.username + "</wsse:Username>" +
						"<wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest\">" + digest + "</wsse:Password>" +
						"<wsse:Nonce>" + nonce + "</wsse:Nonce>" +
						"<wsu:Created>" + created + "</wsu:Created>" +
					"</wsse:UsernameToken>";
	}
});
