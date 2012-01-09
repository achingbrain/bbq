package org.bbqjs.spring.ajax;

import java.net.URL;

import javax.servlet.http.HttpServletRequest;

/**
 * A RequestForwarder which sends all requests to one server
 */
public class SingleServerRequestForwarder extends RequestForwarder {
	private String destinationServer;
	
	@Override
	protected URL getUrlToForwardTo(HttpServletRequest request) throws Exception {
		return new URL(destinationServer);
	}
	
	public void setDestinationServer(String destinationServer) {
		this.destinationServer = destinationServer;
	}
}
