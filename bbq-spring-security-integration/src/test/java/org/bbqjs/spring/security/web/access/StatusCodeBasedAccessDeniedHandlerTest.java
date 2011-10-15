package org.bbqjs.spring.security.web.access;

import org.junit.Before;
import org.junit.Test;
import org.springframework.security.access.AccessDeniedException;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class StatusCodeBasedAccessDeniedHandlerTest {
	private StatusCodeBasedAccessDeniedHandler handler;

	@Before
	public void setUp() throws Exception {
		handler = new StatusCodeBasedAccessDeniedHandler();
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

		verify(response).setStatus(eq(401));
	}

	@Test
	public void testHandle_customCode() throws Exception {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		AccessDeniedException exception = mock(AccessDeniedException.class);
		ServletOutputStream outputStream = mock(ServletOutputStream.class);
		when(response.getOutputStream()).thenReturn(outputStream);
		int code = 2;

		handler.setStatus(2);

		// the method under test
		handler.handle(request, response, exception);

		verify(response).setStatus(eq(2));
	}
}
