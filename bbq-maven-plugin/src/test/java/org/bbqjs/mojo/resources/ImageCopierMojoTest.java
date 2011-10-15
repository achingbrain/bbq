package org.bbqjs.mojo.resources;

import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.junit.Test;

import java.io.File;
import java.net.URL;
import java.util.Collections;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 13/08/2011
 * Time: 11:56
 * To change this template use File | Settings | File Templates.
 */
public class ImageCopierMojoTest {

	@Test
	public void testExecute() throws Exception {
		URL inputDirectoryUrl = getClass().getClassLoader().getResource("ImageCopierMojoTest");
		File inputDirectory = new File(inputDirectoryUrl.getFile());
		File outputDirectory = new File(System.getProperty("java.io.tmpdir"));

		MavenProject project = mock(MavenProject.class);
		when(project.getRuntimeClasspathElements()).thenReturn(Collections.EMPTY_LIST);
		
		ImageCopierMojo mojo = new ImageCopierMojo();
		mojo.setInputDirectory(inputDirectory);
		mojo.setOutputDirectory(outputDirectory);
		mojo.setProject(project);
		mojo.setDescriptor(mock(PluginDescriptor.class));


		mojo.execute();

		File copiedFile = new File(System.getProperty("java.io.tmpdir") + File.separatorChar + "test.png");

		assertTrue("Did not copy file to " + copiedFile.getAbsolutePath(), copiedFile.exists());

		copiedFile.delete();
	}
}
