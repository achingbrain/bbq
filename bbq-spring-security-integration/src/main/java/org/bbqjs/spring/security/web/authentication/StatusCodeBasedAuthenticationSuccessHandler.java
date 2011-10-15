package org.bbqjs.spring.security.web.authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Sends an HTTP status code when authentication fails - defaults to 200 OK
 */
public class StatusCodeBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
	private int status = HttpServletResponse.SC_OK;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		response.setStatus(status);
	}

	public void setStatus(int status) {
		this.status = status;
	}
}
