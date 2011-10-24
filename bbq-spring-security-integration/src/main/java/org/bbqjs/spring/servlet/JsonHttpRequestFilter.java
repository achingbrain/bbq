package org.bbqjs.spring.servlet;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Wraps a HttpServletRequest in a proxy object which converts the message body into JSON so
 * we can use HttpServletRequest#getParameter in methods that can't take advantage of
 * Jackson message conversion.
 *
 * Use this filter in conjunction with Spring Security's UsernamePasswordAuthenticationFilter
 * and/or TokenBasedRememberMeServices
 */
public class JsonHttpRequestFilter implements Filter {
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		if(request.getContentType().indexOf("application/json") !=  -1 && request instanceof HttpServletRequest) {
			request = new JsonHttpServletRequest((HttpServletRequest)request);
		}

		filterChain.doFilter(request, response);
	}

	@Override
	public void destroy() {

	}
}
