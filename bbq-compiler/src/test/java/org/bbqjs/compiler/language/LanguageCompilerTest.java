package org.bbqjs.compiler.language;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Properties;

import org.junit.Test;

public class LanguageCompilerTest {
	
	@Test
	public void testCompile() throws Exception {
		Locale locale = Locale.UK;
		
		URL inputFile = getClass().getClassLoader().getResource("lib2/pages/Page1.js");
		String[] libraries = new String[] {
			"library"
		};
		
		LanguageCompiler compiler = new LanguageCompiler(locale, null, libraries);
		String output = compiler.compile(inputFile, "lib2.pages", null);
		System.out.println(output);
		
		InputStream inputStream = new ByteArrayInputStream(output.getBytes());
		
		Properties properties = new Properties();
		properties.loadFromXML(inputStream);
		
		assertNotNull(properties.get("lib1.foo.Bar.banana"));
		assertNotNull(properties.get("lib1.pages.Page.colour"));
		assertNotNull(properties.get("library.translation"));
	}
	
	@Test
	public void testCompile_loadFromClasspath() throws Exception {
		Locale locale = Locale.UK;
		
		URL inputFile = getClass().getClassLoader().getResource("lib2/pages/Page1.js");
		
		LanguageCompiler compiler = new LanguageCompiler(locale, null, null);
		String output = compiler.compile(inputFile, "lib2.pages", null);
		
		InputStream inputStream = new ByteArrayInputStream(output.getBytes());
		
		Properties properties = new Properties();
		properties.loadFromXML(inputStream);
		
		assertNotNull(properties.get("lib1.foo.Bar.banana"));
		assertNotNull(properties.get("lib1.pages.Page.colour"));
		assertEquals(null, properties.get("library.translation"));
	}
}
