package org.bbqjs.spring.security.web.authentication;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Sends an HTTP status code when authentication fails - defaults to 401 UNAUTHORIZED
 */
public class StatusCodeBasedAuthenticationFailureHandler implements AuthenticationFailureHandler {
	private int status = HttpServletResponse.SC_UNAUTHORIZED;

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
		response.setStatus(status);
	}

	public void setStatus(int status) {
		this.status = status;
	}
}
