package org.bbqjs.spring.security.web.access;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Sends an HTTP status code when an attempt to access a secured resource fails - defaults to 401 UNAUTHORIZED
 */
public class StatusCodeBasedAccessDeniedHandler implements AccessDeniedHandler {
	private int status = HttpServletResponse.SC_UNAUTHORIZED;

	/**
	 * @inheritdoc
	 * @param request
	 * @param response
	 * @param accessDeniedException
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
		response.setStatus(status);
	}

	/**
	 * Override the HTTP status code that is sent access to a resource is denied.  Defaults to 401.
	 * @param status
	 */
	public void setStatus(int status) {
		this.status = status;
	}
}
