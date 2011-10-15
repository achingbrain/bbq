package org.bbqjs.spring.security.web.authentication;

public class AuthenticationRequest {
	private String principal;
	private String password;
	
	public String getPrincipal() {
		return principal;
	}
	
	public void setPrincipal(String principal) {
		this.principal = principal;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
}
