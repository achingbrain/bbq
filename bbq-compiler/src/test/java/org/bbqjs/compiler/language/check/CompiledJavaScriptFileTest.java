package org.bbqjs.compiler.language.check;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.net.URL;

import org.junit.Before;
import org.junit.Test;

public class CompiledJavaScriptFileTest {
	private CompiledJavaScriptFile compiledJavaScriptFile;
	
	@Before
	public void setUp() throws Exception {
		compiledJavaScriptFile = new CompiledJavaScriptFile();
	}
	
	@Test
	public void testContains() throws Exception {
		URL file = getClass().getClassLoader().getResource("CompiledJavaScriptFileTest/file.js");
		compiledJavaScriptFile.setFile(file);
		
		assertTrue("Should have been true", compiledJavaScriptFile.contains("bbq.web.EditWatcher.unsavedchanges"));
		assertFalse("Should have been false", compiledJavaScriptFile.contains("foo.bar"));
	}
	
	@Test
	public void testContainsArray() throws Exception {
		URL file = getClass().getClassLoader().getResource("CompiledJavaScriptFileTest/file.js");
		compiledJavaScriptFile.setFile(file);
		
		assertTrue("Should have been true", compiledJavaScriptFile.containsArray("deadline.gui.button.AssignmentStatusIcon.assignmentstatus"));
		assertFalse("Should have been false", compiledJavaScriptFile.containsArray("foo.bar"));
	}
	
	@Test
	public void testOccurrenceCount() throws Exception {
		URL file = getClass().getClassLoader().getResource("CompiledJavaScriptFileTest/file.js");
		compiledJavaScriptFile.setFile(file);
		
		assertEquals(3, compiledJavaScriptFile.occurrencesOf("deadline.shared.yes"));
	}
	
	@Test
	public void testGetArrayString() throws Exception {
		assertEquals("foo", compiledJavaScriptFile.getArrayString("foo1"));
		assertEquals("foo", compiledJavaScriptFile.getArrayString("foo12"));
		assertEquals("foo", compiledJavaScriptFile.getArrayString("foo123"));
	}
}
