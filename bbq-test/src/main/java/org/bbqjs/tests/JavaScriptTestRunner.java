package org.bbqjs.tests;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.bbqjs.compiler.javascript.JavaScriptCompiler;
import org.bbqjs.tests.TestResult.TYPE;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.tools.shell.Global;
import org.mozilla.javascript.tools.shell.Main;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JavaScriptTestRunner {
	private static Logger LOG = LoggerFactory.getLogger(JavaScriptTestRunner.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private String[] includes;
	private URL testFile;
	private String testPackage;
	private String testName;
	private static Context context;
	private static Scriptable scope;
	private Date startDate;
	private String[] sourceRoots;
	
	protected Context getContext() throws Exception {
		if(context == null) {
			context = ContextFactory.getGlobal().enterContext();
			context.setOptimizationLevel(-1);
			context.setLanguageVersion(Context.VERSION_1_5);
			Global global = Main.getGlobal();
			global.init(context);
			
			// create javascript global scope
			scope = context.initStandardObjects();
		}
		
		return context;
	}
	
	public TestResult runTest() throws Exception {
		startDate = new Date();

		String[] pathComponents = testFile.toString().split("/");

		if(testPackage != null && !testPackage.trim().equals("")) {
			testPackage = testPackage.replaceAll("/", ".");

			if(!testPackage.endsWith(".")) {
				testPackage += ".";
			}
		} else {
			testPackage = "";
		}
		
		testName = testPackage + pathComponents[pathComponents.length - 1];

		if(testName.endsWith(".js")) {
			testName = testName.substring(0, testName.length() - 3);
		}
		
		Context context = getContext();
		
		System.out.println("Running " + testName);
		
		// parse any includes in JavaScript file
		JavaScriptCompiler compiler = new JavaScriptCompiler(includes);
		String compiledJavaScript = compiler.compile(testFile, testPackage, sourceRoots);
		
		// run unit test
		context.evaluateString(scope, compiledJavaScript, null, 0, null);
		
		// find test in scope
		Object output = scope.get("test", null);
		
		if(!(output instanceof NativeObject)) {
			return new TestResult(TYPE.ERROR, "Could not parse output of JavaScript Unit Test - there is probably a syntax error in your JavaScript test");
		}
		
		NativeObject test = (NativeObject)output;
		
		// call summary() method on test
		NativeObject summary = (NativeObject)NativeObject.callMethod(test, "summary", new Object[]{});
		
		return parseResult(summary);
	}
	
	public TestResult parseResult(NativeObject result) {
		int failures = getInteger("failed", result);
		int errors = getInteger("errors", result);
		int tests = getInteger("tests", result);
		String message = null;
		
		for(String line : getStringArray("messages", result)) {
			message = line;
			
			System.out.println(testName + ": " + line);
		}
		
		double elapsed = (new Date().getTime() - startDate.getTime()) / 1000;
		
		System.out.println("Tests run: " + tests + ", Failures: " + failures + ", Errors: " + errors + ", Time elapsed: " + elapsed + " sec");
		
		if(tests == 0) {
			return new TestResult(TYPE.ERROR, testName, "No tests found in " + testName);
		}
		
		if(failures > 0) {
			return new TestResult(TYPE.FAIL, testName, message == null ? "Test " + testName + " failed" : message);
		}
		
		if(errors > 0) {
			return new TestResult(TYPE.ERROR, testName, message == null ? "Test " + testName + " errored" : message);
		}
		
		return new TestResult(TYPE.SUCCESS, testName);
	}
	
	private int getInteger(String key, NativeObject fromObject) {
		Object result = fromObject.get(key, null);
		
		if(result.equals(Scriptable.NOT_FOUND)) {
			return 0;
		}
		
		return ((Double)result).intValue();
	}
	
	private String[] getStringArray(String key, NativeObject fromObject) {
		Object result = fromObject.get(key, null);
		
		if(result.equals(Scriptable.NOT_FOUND)) {
			return new String[]{};
		}
		
		NativeArray messages = (NativeArray)result;
		
		String[] output = new String[((Long)messages.getLength()).intValue()];
		
		for(int index = 0; index < messages.getLength(); index++) {
			output[index] = (String)messages.get(index, messages);
		}
		
		return output;
	}
	
	public void setIncludes(String[] includes) {
		List<String> list = new ArrayList<String>();
		list.add("javascript/env/env-shim.js");
		list.add("javascript/env/env.js");

		if(includes != null) {
			for (String include : includes) {
				list.add(include);
			}
		}

		this.includes = list.toArray(new String[]{});
	}
	
	public void setTestFile(URL testFile) {
		if(testFile == null) {
			throw new RuntimeException("Unit test file was null.");
		}

		this.testFile = testFile;
	}
	
	public void setTestPackage(String testPackage) {
		this.testPackage = testPackage;
	}

	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}
}
