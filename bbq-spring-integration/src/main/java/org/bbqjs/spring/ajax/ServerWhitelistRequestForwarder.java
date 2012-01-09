package org.bbqjs.spring.ajax;

import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.URL;
import java.util.Collections;
import java.util.List;

/**
 * A RequestForwarder which only allows forwarding to pre-ordained servers
 */
public class ServerWhitelistRequestForwarder extends RequestForwarder {
	private List<String> whiteList = Collections.EMPTY_LIST;

	@Override
	protected URL getUrlToForwardTo(HttpServletRequest request) throws Exception {
		String header = request.getHeader(headerName);

		if(StringUtils.isEmpty(header)) {
			throw new IllegalArgumentException("Could not determine where to forward to.  Did you send the " + headerName + " header?  All I could find was " + header);
		}

		if(!whiteList.contains(header)) {
			throw new IllegalArgumentException("Not forwarding to " + header + ".  To forward to this url, please add it to the whitelist.");
		}

		return new URL(header);
	}

	/**
	 * This list contains servers which we allow sending requests to.  E.g:
	 *
	 * <pre><code class="language-xml">
	 * &lt;list&gt;
	 *     &lt;value&gt;http://www.google.com&lt;/value&gt;
	 *     &lt;value&gt;http://www.yahoo.com&lt;/value&gt;
	 * &lt;/list&gt;
	 * </code></pre>
	 * @param whiteList
	 */
	public void setWhiteList(List<String> whiteList) {
		this.whiteList = whiteList;
	}
}
