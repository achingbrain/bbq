package org.bbqjs.compiler.exceptions;

public class ClassFileNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 7018157065958384619L;
	
	public ClassFileNotFoundException(String message) {
		super(message);
	}
	
	public ClassFileNotFoundException(String message, Throwable t) {
		super(message, t);
	}
}
