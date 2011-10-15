package org.bbqjs.compiler.javascript;

import org.junit.Test;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;

public class JavaScriptCompilerTest {
	
	@Test
	public void testJavaScriptCompiler() throws Exception {
		URL inputFile = getClass().getClassLoader().getResource("lib2/pages/Page1.js");
		String[] libraries = new String[] {
			"library.js"
		};

		JavaScriptCompiler compiler = new JavaScriptCompiler(libraries);
		String output = compiler.compile(inputFile, "lib2.pages", null);
		System.out.println(output);
		
		// got namespaces
		assertFalse(-1 == output.indexOf("window[\"lib1\"] = {"));
		assertFalse(-1 == output.indexOf("window[\"lib2\"] = {"));
		
		// got class definitions
		assertFalse(-1 == output.indexOf("lib1.pages.Page = new Class.create();"));
		assertFalse(-1 == output.indexOf("lib2.pages.Page1.prototype.init = function(args) {"));

		// got library function
		assertFalse(-1 == output.indexOf("libraryFunction"));
	}
}
