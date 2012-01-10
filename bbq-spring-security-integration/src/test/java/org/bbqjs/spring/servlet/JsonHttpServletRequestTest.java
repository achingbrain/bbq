package org.bbqjs.spring.servlet;

import org.junit.Before;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import sun.net.idn.StringPrep;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.byteThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 10/01/2012
 * Time: 14:49
 * To change this template use File | Settings | File Templates.
 */
public class JsonHttpServletRequestTest {
	private JsonHttpServletRequest request;

	@Before
	public void setUp() throws Exception {
		// set up html body with valid json object
		final String body = "{ foo: 'bar', baz: 'qux' }";

		HttpServletRequest request = mock(HttpServletRequest.class);
		ServletInputStream inputStream = mock(ServletInputStream.class);
		
		when(inputStream.read(any(byte[].class))).thenAnswer(new Answer<Integer>() {
			private int count = 0; 
			
			@Override
			public Integer answer(InvocationOnMock invocation) throws Throwable {
				if(count == body.length()) {
					// no more characters to read...
					return -1;
				}
				
				byte[] buffer = (byte[])invocation.getArguments()[0];

				for(int i = 0; i < buffer.length; i++) {
					if(i == body.length()) {
						break;
					}

					buffer[i] = (byte)body.charAt(i);
					count++;
				}

				return count;
			}
		});

		when(request.getInputStream()).thenReturn(inputStream);
		when(request.getCharacterEncoding()).thenReturn("UTF-8");

		this.request = new JsonHttpServletRequest(request);
	}

	@Test
	public void testGetParameter() throws Exception {
		assertEquals("bar", request.getParameter("foo"));
		assertEquals("qux", request.getParameter("baz"));
	}

	@Test
	public void testGetParameterNames() throws Exception {
		Enumeration<String> enumeration = request.getParameterNames();
		boolean foundBoth = false;
		int count = 0;
		
		while(enumeration.hasMoreElements()) {
			String parameterName = enumeration.nextElement();

			foundBoth = parameterName.equals("bar") || parameterName.equals("baz");
			count++;
		}

		assertEquals(2, count);
		assertTrue(foundBoth);
	}

	@Test
	public void testGetParameterValues() throws Exception {
		String[] values = request.getParameterValues("foo");
		
		assertEquals(1, values.length);
		assertEquals("bar", values[0]);

		values = request.getParameterValues("baz");

		assertEquals(1, values.length);
		assertEquals("qux", values[0]);
	}

	@Test
	public void testGetParameterMap() throws Exception {
		Map map = request.getParameterMap();
		
		assertTrue(map.containsKey("foo"));
		assertTrue(map.containsKey("baz"));
		assertTrue(map.containsValue("bar"));
		assertTrue(map.containsValue("qux"));
	}
}
