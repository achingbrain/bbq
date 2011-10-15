package org.bbqjs.compiler.exceptions;

public class CompilationFailureException extends RuntimeException {
	private static final long serialVersionUID = -4558109609037680937L;
	
	public CompilationFailureException(Throwable t) {
		super(t);
	}
	
	public CompilationFailureException(String message, Throwable t) {
		super(message, t);
	}
	
	public CompilationFailureException(String message) {
		super(message);
	}
}
