package org.bbqjs.spring.security.web.authentication;

import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 10/01/2012
 * Time: 14:33
 * To change this template use File | Settings | File Templates.
 */
public class HeaderBasedAuthenticationFailureHandlerTest {
	private HeaderBasedAuthenticationFailureHandler handler;

	@Before
	public void setUp() throws Exception {
		handler = new HeaderBasedAuthenticationFailureHandler();
	}

	@Test
	public void testOnAuthenticationFailure() throws Exception {
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

		AuthenticationException authenticationException = mock(AuthenticationException.class);
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		PrintWriter writer = mock(PrintWriter.class);
		
		when(response.getWriter()).thenReturn(writer);

		// the method under test
		handler.onAuthenticationFailure(request, response, authenticationException);

		verify(response, times(1)).addIntHeader(eq(responseTypeHeader), eq(responseCode));
		verify(response, times(1)).addHeader(eq(responseMessageHeader), eq(responseMessage));
		verify(writer, times(1)).write(eq(json));
	}
}
