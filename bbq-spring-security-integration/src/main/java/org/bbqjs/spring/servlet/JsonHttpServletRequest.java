package org.bbqjs.spring.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import net.sf.json.JSONObject;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

/**
 * Wraps a HttpServletRequest that has had it's request body turned into a JSON object.
 *
 * N.B. this only really works well with simple JSON objects - ie ones where the properties are only one level deep:
 *
 * <pre><code class="language-javascript">
 * { foo: "bar" }
 * </code></pre>
 *
 * and not
 *
 * <pre><code class="language-javascript">
 * { foo: { bar : "baz" } }
 * </code></pre>
 */
public class JsonHttpServletRequest extends HttpServletRequestWrapper {
	private JSONObject jsonObject;

	/**
	 * @param request
	 * @throws IOException
	 */
	public JsonHttpServletRequest(HttpServletRequest request) throws IOException {
		super(request);

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		IOUtils.copy(request.getInputStream(), outputStream);
		String body = outputStream.toString(request.getCharacterEncoding());

		if(!StringUtils.isBlank(body)) {
			jsonObject = JSONObject.fromObject(body);
		}
	}

	/**
	 * @inheritdoc
	 * @param name
	 * @return
	 */
	@Override
	public String getParameter(String name) {
		if(jsonObject == null) {
			return super.getParameter(name);
		}

		if(!jsonObject.containsKey(name)) {
			return null;
		}

		return jsonObject.getString(name);
	}

	/**
	 * @inheritdoc
	 * @return
	 */
	@Override
	public Enumeration<?> getParameterNames() {
		if(jsonObject == null) {
			return super.getParameterNames();
		}

		final Iterator<?> iterator = jsonObject.keySet().iterator();

		return new Enumeration<Object>() {
			@Override
			public boolean hasMoreElements() {
				return iterator.hasNext();
			}

			@Override
			public Object nextElement() {
				return iterator.next();
			}
		};
	}

	/**
	 * @inheritdoc
	 * @param name
	 * @return
	 */
	@Override
	public String[] getParameterValues(String name) {
		if(jsonObject == null) {
			return super.getParameterValues(name);
		}

		if(!jsonObject.containsKey(name)) {
			return null;
		}

		return new String[] {jsonObject.getString(name)};
	}

	/**
	 * @inheritdoc
	 * @return
	 */
	@Override
	public Map<?, ?> getParameterMap() {
		if(jsonObject == null) {
			return super.getParameterMap();
		}

		return jsonObject;
	}
}
