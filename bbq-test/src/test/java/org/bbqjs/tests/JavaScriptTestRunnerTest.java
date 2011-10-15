package org.bbqjs.tests;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.bbqjs.tests.TestResult.TYPE;
import org.junit.Before;
import org.junit.Test;

public class JavaScriptTestRunnerTest {
	private JavaScriptTestRunner testRunner;
	
	@Before
	public void setUp() throws Exception {
		String[] includes = new String[] {
			"javascript/prototype/prototype.1.6.0.2.js",
			"javascript/scriptaculous/unittest.1.8.0.js"
		};
		
		testRunner = new JavaScriptTestRunner();
		testRunner.setIncludes(includes);
	}
	
	@Test
	public void testEmptyJavaScriptTest() throws Exception {
		testRunner.setTestFile(getClass().getClassLoader().getResource("JavaScriptTestRunnerTest/EmptyJavaScriptTest.js"));
		testRunner.setTestPackage("JavaScriptTestRunnerTest");
		
		TestResult result = testRunner.runTest();
		
		assertEquals(TYPE.ERROR, result.getType());
	}
	
	@Test
	public void testJavaScriptTest() throws Exception {
		testRunner.setTestFile(getClass().getClassLoader().getResource("JavaScriptTestRunnerTest/JavaScriptTest.js"));
		testRunner.setTestPackage("JavaScriptTestRunnerTest");
		
		TestResult result = testRunner.runTest();
		
		assertEquals(TYPE.SUCCESS, result.getType());
	}
	
	@Test
	public void testFailingJavaScriptTest() throws Exception {
		testRunner.setTestFile(getClass().getClassLoader().getResource("JavaScriptTestRunnerTest/FailingJavaScriptTest.js"));
		testRunner.setTestPackage("JavaScriptTestRunnerTest");
		
		TestResult result = testRunner.runTest();
		
		assertEquals(TYPE.FAIL, result.getType());
		assertEquals("Failure: Oh noes!", result.getMessage());
	}
}
