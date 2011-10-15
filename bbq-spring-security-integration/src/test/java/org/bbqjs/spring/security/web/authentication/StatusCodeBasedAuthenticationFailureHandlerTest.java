package org.bbqjs.spring.security.web.authentication;

import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 14/10/2011
 * Time: 12:21
 * To change this template use File | Settings | File Templates.
 */
public class StatusCodeBasedAuthenticationFailureHandlerTest {
	private StatusCodeBasedAuthenticationFailureHandler handler;

	@Before
	public void setUp() throws Exception {
		handler = new StatusCodeBasedAuthenticationFailureHandler();
	}

	@Test
	public void testOnAuthenticationFailure() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		AuthenticationException exception = mock(AuthenticationException.class);
		ServletOutputStream outputStream = mock(ServletOutputStream.class);
		when(response.getOutputStream()).thenReturn(outputStream);

		// the method under test
		handler.onAuthenticationFailure(request, response, exception);

		verify(response).setStatus(eq(401));
	}

	@Test
	public void testHandle_customCode() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		AuthenticationException exception = mock(AuthenticationException.class);
		ServletOutputStream outputStream = mock(ServletOutputStream.class);
		when(response.getOutputStream()).thenReturn(outputStream);
		int code = 2;

		handler.setStatus(2);

		// the method under test
		handler.onAuthenticationFailure(request, response, exception);

		verify(response).setStatus(eq(2));
	}
}
