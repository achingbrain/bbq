package org.bbqjs.spring.security.web.authentication;

import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class StatusCodeBasedAuthenticationSuccessHandlerTest {
	private StatusCodeBasedAuthenticationSuccessHandler handler;

	@Before
	public void setUp() throws Exception {
		handler = new StatusCodeBasedAuthenticationSuccessHandler();
	}

	@Test
	public void testOnAuthenticationSuccess() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		Authentication authentication = mock(Authentication.class);

		// the method under test
		handler.onAuthenticationSuccess(request, response, authentication);

		verify(response).setStatus(eq(HttpServletResponse.SC_OK));
	}

	@Test
	public void testHandle_customCode() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		Authentication authentication = mock(Authentication.class);
		int code = 2;

		handler.setStatus(2);

		// the method under test
		handler.onAuthenticationSuccess(request, response, authentication);

		verify(response).setStatus(eq(2));
	}
}
