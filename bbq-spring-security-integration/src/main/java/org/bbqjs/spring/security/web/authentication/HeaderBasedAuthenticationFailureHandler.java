package org.bbqjs.spring.security.web.authentication;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.bbqjs.spring.mvc.ErrorController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class HeaderBasedAuthenticationFailureHandler implements AuthenticationFailureHandler {
	private static Logger LOG = LoggerFactory.getLogger(HeaderBasedAuthenticationFailureHandler.class);

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
		LOG.warn("Authentication failure", exception);

		response.addIntHeader(ErrorController.X_BBQ_RESPONSE_TYPE, 0);
		response.addHeader(ErrorController.X_BBQ_RESPONSE_MESSAGE, "Not authenticated");

		HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response);
		Writer out = responseWrapper.getWriter();

		out.write("{result: false}");
		out.close();
	}
}
