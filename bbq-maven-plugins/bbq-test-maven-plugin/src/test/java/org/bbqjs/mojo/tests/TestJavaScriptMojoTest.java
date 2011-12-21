package org.bbqjs.mojo.tests;

import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.plugin.logging.Log;
import org.apache.maven.project.MavenProject;
import org.junit.Test;

import java.io.File;
import java.net.URL;
import java.util.Collections;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 13/08/2011
 * Time: 11:10
 * To change this template use File | Settings | File Templates.
 */
public class TestJavaScriptMojoTest {

	@Test
	public void testExecute() throws Exception {
		URL testDirectoryUrl = getClass().getClassLoader().getResource("TestJavaScriptMojoTest");
		File testDirectory = new File(testDirectoryUrl.getFile());

		MavenProject project = mock(MavenProject.class);
		when(project.getRuntimeClasspathElements()).thenReturn(Collections.EMPTY_LIST);

		TestJavaScriptMojo mojo = new TestJavaScriptMojo();
		mojo.setLog(mock(Log.class));
		mojo.setTestDirectory(testDirectory);
		mojo.setIncludes(new String[] {
			"javascript/prototype/prototype.1.6.0.2.js",
			"javascript/scriptaculous/unittest.1.8.0.js"
		});
		mojo.setProject(project);
		mojo.setDescriptor(mock(PluginDescriptor.class));

		// the method under test
		mojo.execute();
	}
}
