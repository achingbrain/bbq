package org.bbqjs.spring.security.web.access;

import org.bbqjs.spring.mvc.ErrorController;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Sends a X-BBQ-ResponseType header with the value 0 which you should extract from the XMLHttpRequest object.
 *
 * The header names and values are overridable.
 */
public class HeaderBasedAccessDeniedHandler implements AccessDeniedHandler {
	private String loginFormUrl;
	private String responseTypeHeader = ErrorController.X_BBQ_RESPONSE_TYPE;
	private int responseCode = 0;
	private String responseMessageHeader = ErrorController.X_BBQ_RESPONSE_MESSAGE;
	private String responseMessage = "Not authenticated";

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
		response.addIntHeader(responseTypeHeader, responseCode);
		response.addHeader(responseMessageHeader, responseMessage);

		if(loginFormUrl != null) {
			// redirect user to log in form
			response.setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
			response.addHeader("location", loginFormUrl);
		}

		OutputStream out = response.getOutputStream();
		out.write(responseMessage.getBytes());
		out.close();
	}

	/**
	 * If set, a 307 redirect will be issued to bounce the user to the log in form.
	 * @param loginFormUrl
	 */
	public void setLoginFormUrl(String loginFormUrl) {
		this.loginFormUrl = loginFormUrl;
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
}
