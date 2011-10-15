package org.bbqjs.spring.security.web.authentication;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

public class AuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {
	private static final Logger LOG = LoggerFactory.getLogger(AuthenticationProcessingFilter.class);
	private List<HttpMessageConverter<AuthenticationRequest>> messageConverters;
	
	public AuthenticationProcessingFilter() {
		super(null);
	}
	
	protected AuthenticationProcessingFilter(String defaultFilterProcessesUrl) {
		super(defaultFilterProcessesUrl);
	}
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
		for(HttpMessageConverter<AuthenticationRequest> messageConverter : messageConverters) {
			try {
				AuthenticationRequest authenticationRequest = messageConverter.read(AuthenticationRequest.class, new ServletServerHttpRequest(request));
				
				List<GrantedAuthority> authorityList = new ArrayList<GrantedAuthority>();
				authorityList.add(new GrantedAuthorityImpl("ROLE_USER"));
				
				Authentication authentication = new UsernamePasswordAuthenticationToken(authenticationRequest.getPrincipal(), authenticationRequest.getPassword(), authorityList); 
				
				getAuthenticationManager().authenticate(authentication);
				
				return authentication;
			} catch(IOException e) {
				LOG.debug("Failed to read Authentication information with converter" + messageConverter, e);
			} catch(HttpMessageNotReadableException e) {
				LOG.debug("Failed to read Authentication information with converter" + messageConverter, e);
			}
		}
		
		throw new AuthenticationCredentialsNotFoundException("Could not retrieve authentication information from request");
	}
	
	/**
	 * Use this if you only have one message conversion strategy
	 * @param messageConverter
	 */
	public void setMessageConverter(HttpMessageConverter<AuthenticationRequest> messageConverter) {
		messageConverters = new ArrayList<HttpMessageConverter<AuthenticationRequest>>();
		messageConverters.add(messageConverter);
	}

	/**
	 * Use this if you only have message conversion strategies
	 * @param messageConverters
	 */
	public void setMessageConverters(List<HttpMessageConverter<AuthenticationRequest>> messageConverters) {
		this.messageConverters = messageConverters;
	}
}
