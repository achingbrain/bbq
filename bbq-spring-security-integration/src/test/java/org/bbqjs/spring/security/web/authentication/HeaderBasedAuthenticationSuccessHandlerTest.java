package org.bbqjs.spring.security.web.authentication;

import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 10/01/2012
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */
public class HeaderBasedAuthenticationSuccessHandlerTest {
	private HeaderBasedAuthenticationSuccessHandler handler;

	@Before
	public void setUp() throws Exception {
		handler = new HeaderBasedAuthenticationSuccessHandler();
	}

	@Test
	public void testOnAuthenticationSuccess() throws Exception {
		String responseTypeHeader = "foo";
		int responseCode = 42;
		String json = "{foo: 'bar'}";
		String responseMessageHeader = "bar";
		String responseMessage = "baz";

		handler.setResponseJSON(json);
		handler.setResponseTypeHeader(responseTypeHeader);
		handler.setResponseCode(responseCode);
		handler.setResponseMessageHeader(responseMessageHeader);
		handler.setResponseMessage(responseMessage);

		Authentication authentication = mock(Authentication.class);
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		PrintWriter writer = mock(PrintWriter.class);

		when(response.getWriter()).thenReturn(writer);

		// the method under test
		handler.onAuthenticationSuccess(request, response, authentication);

		verify(response, times(1)).addIntHeader(eq(responseTypeHeader), eq(responseCode));
		verify(response, times(1)).addHeader(eq(responseMessageHeader), eq(responseMessage));
		verify(writer, times(1)).write(eq(json));
	}
}
