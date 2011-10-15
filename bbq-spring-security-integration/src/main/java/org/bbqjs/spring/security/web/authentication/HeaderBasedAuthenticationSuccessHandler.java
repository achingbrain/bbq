package org.bbqjs.spring.security.web.authentication;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.bbqjs.spring.mvc.ErrorController;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class HeaderBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		response.addIntHeader(ErrorController.X_BBQ_RESPONSE_TYPE, 1);
		response.addHeader(ErrorController.X_BBQ_RESPONSE_MESSAGE, "Authenticated OK");

		HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response);
		Writer out = responseWrapper.getWriter();

		out.write("{result: true}");
		out.close();
	}
}
