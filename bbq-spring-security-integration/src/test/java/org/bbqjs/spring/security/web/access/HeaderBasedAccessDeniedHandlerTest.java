package org.bbqjs.spring.security.web.access;

import org.junit.Before;
import org.junit.Test;
import org.springframework.security.access.AccessDeniedException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 14/10/2011
 * Time: 11:56
 * To change this template use File | Settings | File Templates.
 */
public class HeaderBasedAccessDeniedHandlerTest {
	private HeaderBasedAccessDeniedHandler handler;

	@Before
	public void setUp() throws Exception {
		handler = new HeaderBasedAccessDeniedHandler();
	}

	@Test
	public void testHandle() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		AccessDeniedException exception = mock(AccessDeniedException.class);
		ServletOutputStream outputStream = mock(ServletOutputStream.class);
		when(response.getOutputStream()).thenReturn(outputStream);

		// the method under test
		handler.handle(request, response, exception);

		verify(response).addIntHeader(eq("X-BBQ-ResponseType"), eq(0));
		verify(response).addHeader(eq("X-BBQ-ResponseMessage"), eq("Not authenticated"));
	}

	@Test
	public void testHandle_customCode() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		AccessDeniedException exception = mock(AccessDeniedException.class);
		ServletOutputStream outputStream = mock(ServletOutputStream.class);
		when(response.getOutputStream()).thenReturn(outputStream);

		String responseTypeHeader = "foo";
		int responseCode = 42;
		String responseMessageHeader = "bar";
		String responseMessage = "baz";
		String loginFormUrl = "/some/url";

		handler.setLoginFormUrl(loginFormUrl);
		handler.setResponseTypeHeader(responseTypeHeader);
		handler.setResponseCode(responseCode);
		handler.setResponseMessageHeader(responseMessageHeader);
		handler.setResponseMessage(responseMessage);

		// the method under test
		handler.handle(request, response, exception);

		verify(response).addIntHeader(eq(responseTypeHeader), eq(responseCode));
		verify(response).addHeader(eq(responseMessageHeader), eq(responseMessage));
		verify(response).setStatus(eq(HttpServletResponse.SC_TEMPORARY_REDIRECT));
		verify(response).addHeader(eq("location"), eq(loginFormUrl));
	}
}
