package org.bbqjs.spring.servlet;

import net.sf.json.JSONObject;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;

/**
 * Wraps a HttpServletRequest that has had it's request body turned into a JSON object
 */
public class JsonHttpServletRequest extends HttpServletRequestWrapper {
	private JSONObject jsonObject;

	public JsonHttpServletRequest(HttpServletRequest request) throws IOException {
		super(request);

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		IOUtils.copy(request.getInputStream(), outputStream);
		String body = outputStream.toString(request.getCharacterEncoding());

		if(!StringUtils.isBlank(body)) {
			jsonObject = JSONObject.fromObject(body);
		}
	}

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

	@Override
	public Enumeration getParameterNames() {
		if (jsonObject == null) {
			return super.getParameterNames();
		}

		final Iterator<?> iterator = jsonObject.keySet().iterator();

		return new Enumeration() {
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

	@Override
	public String[] getParameterValues(String name) {
		if (jsonObject == null) {
			return super.getParameterValues(name);
		}

		if(!jsonObject.containsKey(name)) {
			return null;
		}

		return new String[] {jsonObject.getString(name)};
	}

	@Override
	public Map getParameterMap() {
		if (jsonObject == null) {
			return super.getParameterMap();
		}

		return jsonObject;
	}
}
