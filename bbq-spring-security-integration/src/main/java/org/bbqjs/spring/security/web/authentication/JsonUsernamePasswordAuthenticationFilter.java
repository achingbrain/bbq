package org.bbqjs.spring.security.web.authentication;

import net.sf.json.JSONObject;
import org.apache.commons.io.IOUtils;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.UnsupportedCharsetException;

public class JsonUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	private boolean postOnly = true;
	private String usernameParameter;
	private String passwordParameter;

	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
		if (postOnly && !request.getMethod().equals("POST")) {
			throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
		}

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		String body;

		try {
			IOUtils.copy(request.getInputStream(), outputStream);
		} catch (IOException e) {
			throw new AuthenticationServiceException("Could not read request body", e);
		}

		try {
			body = outputStream.toString(request.getCharacterEncoding());
		} catch(UnsupportedCharsetException e) {
			throw new AuthenticationServiceException("Could not decode request body - bad character set", e);
		} catch (UnsupportedEncodingException e) {
			throw new AuthenticationServiceException("Could not decode request body - unsupported encoding", e);
		}

		JSONObject jsonObj = JSONObject.fromObject(body);

		String username = jsonObj.getString(usernameParameter);
		String password = jsonObj.getString(passwordParameter);

		if (username == null) {
			username = "";
		}

		if (password == null) {
			password = "";
		}

		username = username.trim();

		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);

		// Allow subclasses to set the "details" property
		setDetails(request, authRequest);

		return this.getAuthenticationManager().authenticate(authRequest);
	}

	public void setPostOnly(boolean postOnly) {
		this.postOnly = postOnly;
	}

	public void setUsernameParameter(String usernameParameter) {
		this.usernameParameter = usernameParameter;

		super.setUsernameParameter(usernameParameter);
	}

	public void setPasswordParameter(String passwordParameter) {
		this.passwordParameter = passwordParameter;

		super.setPasswordParameter(passwordParameter);
	}
}
