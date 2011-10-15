package org.bbqjs.spring.security.web.access;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

public class HeaderBasedAccessDeniedHandler implements AccessDeniedHandler {
	private String loginFormUrl;
	private String responseTypeHeader = "X-BBQ-ResponseType";
	private int responseCode = 0;
	private String responseMessageHeader = "X-BBQ-ResponseMessage";
	private String responseMessage = "Not authenticated";

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
		out.write("Not authenticated".getBytes());
		out.close();
	}

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
