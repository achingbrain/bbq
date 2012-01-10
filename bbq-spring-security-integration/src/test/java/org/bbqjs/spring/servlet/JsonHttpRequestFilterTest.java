package org.bbqjs.spring.servlet;

import org.junit.Before;
import org.junit.Test;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import static org.mockito.Mockito.*;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 10/01/2012
 * Time: 14:45
 * To change this template use File | Settings | File Templates.
 */
public class JsonHttpRequestFilterTest {
	private JsonHttpRequestFilter filter;

	@Before
	public void setUp() throws Exception {
		filter = new JsonHttpRequestFilter();
	}

	@Test
	public void testDoFilter_htmlContentType() throws Exception {
		ServletRequest request = mock(ServletRequest.class);
		ServletResponse response = mock(ServletResponse.class);
		FilterChain filterChain = mock(FilterChain.class);

		// return html content type
		when(request.getContentType()).thenReturn("text/html");
		
		// the method under test
		filter.doFilter(request, response, filterChain);
		
		verify(filterChain, times(1)).doFilter(request, response);
	}

	@Test
	public void testDoFilter_jsonContentType() throws Exception {
		ServletRequest request = mock(ServletRequest.class);
		ServletResponse response = mock(ServletResponse.class);
		FilterChain filterChain = mock(FilterChain.class);

		// return html content type
		when(request.getContentType()).thenReturn("application/json;charset=utf8");

		// the method under test
		filter.doFilter(request, response, filterChain);

		// should have wrapped request in JsonHttpServletRequest
		verify(filterChain, times(1)).doFilter(any(JsonHttpServletRequest.class), eq(response));
	}
}
