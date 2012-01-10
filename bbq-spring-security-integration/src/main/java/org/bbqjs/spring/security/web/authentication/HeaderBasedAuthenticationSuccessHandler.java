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

/**
 * Sends a X-BBQ-ResponseType header with the value 1 and writes {result: true} into the output stream.
 *
 * The header names and values and response JSON are overridable.
 */
public class HeaderBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
	private String responseTypeHeader = ErrorController.X_BBQ_RESPONSE_TYPE;
	private int responseCode = 1;
	private String responseMessageHeader = ErrorController.X_BBQ_RESPONSE_MESSAGE;
	private String responseMessage = "Authenticated OK";
	private String responseJSON = "{result: true}";

	/**
	 * @inheritdoc
	 * @param request
	 * @param response
	 * @param authentication
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		response.addIntHeader(responseTypeHeader, responseCode);
		response.addHeader(responseMessageHeader, responseMessage);

		HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response);
		Writer out = responseWrapper.getWriter();

		out.write(responseJSON);
		out.close();
	}

	public void setResponseTypeHeader(String responseTypeHeader) {
		this.responseTypeHeader = responseTypeHeader;
	}

	public void setResponseCode(int responseCode) {
		this.responseCode = responseCode;
	}

	public void setResponseMessageHeader(String responseMessageHeader) {
		this.responseMessageHeader = responseMessageHeader;
	}

	public void setResponseMessage(String responseMessage) {
		this.responseMessage = responseMessage;
	}

	public void setResponseJSON(String responseJSON) {
		this.responseJSON = responseJSON;
	}
}
