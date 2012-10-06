package org.bbqjs.mojo.resources;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.net.URL;

import org.junit.Test;

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

		ImageCopierMojo mojo = new ImageCopierMojo();
		mojo.setInputDirectory(inputDirectory);
		mojo.setOutputDirectory(outputDirectory);

		mojo.execute();

		File copiedFile = new File(System.getProperty("java.io.tmpdir") + File.separatorChar + "test.png");

		assertTrue("Did not copy file to " + copiedFile.getAbsolutePath(), copiedFile.exists());

		copiedFile.delete();
	}
}
