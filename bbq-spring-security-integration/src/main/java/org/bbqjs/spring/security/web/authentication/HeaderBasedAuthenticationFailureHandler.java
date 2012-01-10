package org.bbqjs.spring.security.web.authentication;

import org.bbqjs.spring.mvc.ErrorController;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import java.io.Writer;

/**
 * Sends a X-BBQ-ResponseType header with the value 0 and writes {result: false} into the output stream.
 *
 * The header names and values and response JSON are overridable.
 */
public class HeaderBasedAuthenticationFailureHandler implements AuthenticationFailureHandler {
	private String responseTypeHeader = ErrorController.X_BBQ_RESPONSE_TYPE;
	private int responseCode = 0;
	private String responseMessageHeader = ErrorController.X_BBQ_RESPONSE_MESSAGE;
	private String responseMessage = "Not authenticated";
	private String responseJSON = "{result: false}";

	/**
	 * @inheritdoc
	 * @param request
	 * @param response
	 * @param exception
	 * @throws IOException
	 * @throws ServletException
	 */
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
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
