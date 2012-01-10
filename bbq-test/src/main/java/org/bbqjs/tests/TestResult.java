package org.bbqjs.tests;

/**
 * This class represents the output of a JavaScript unit test
 */
public class TestResult {
	public enum TYPE {
		SUCCESS,
		FAIL,
		ERROR
	}
	
	private TYPE type;
	private String name;
	private String message;
	
	public TestResult(TYPE type, String name, String message) {
		this(type, name);
		
		this.message = message;
	}
	
	public TestResult(TYPE type, String name) {
		this.type = type;
		this.name = name;
	}
	
	public TYPE getType() {
		return type;
	}
	
	public String getName() {
		return name;
	}
	
	public String getMessage() {
		return message;
	}
}
