package org.bbqjs.compiler.css;

import static org.junit.Assert.assertFalse;

import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.Test;

public class CSSCompilerTest {

	@Test
	public void testCompile() {
		URL inputFile = getClass().getClassLoader().getResource("lib2/pages/Page1.js");
		String[] libraries = new String[]{
			"library.css"
		};

		CSSCompiler compiler = new CSSCompiler("mytheme", libraries);
		String output = compiler.compile(inputFile, "lib2.pages", null);
		System.out.println(output);

		assertFalse(-1 == output.indexOf(".Page"));
		assertFalse(-1 == output.indexOf(".libraryClass {"));
	}

	@Test
	public void testCompileWithClassNameFile() {
		// Page3 has a stylesheet named Page3.css instead of style.css
		URL inputFile = getClass().getClassLoader().getResource("lib2/pages/Page3.js");
		String[] libraries = new String[]{
				"library.css"
		};

		CSSCompiler compiler = new CSSCompiler("mytheme", libraries);
		String output = compiler.compile(inputFile, "lib2.pages", null);
		System.out.println(output);

		assertFalse(-1 == output.indexOf(".Page"));
		assertFalse(-1 == output.indexOf(".libraryClass {"));
		assertFalse(-1 == output.indexOf(".Page3"));
		assertFalse(-1 == output.indexOf(".Baz"));
	}
}
