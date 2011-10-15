package org.bbqjs.mojo.resources;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.DirectoryFileFilter;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.OrFileFilter;
import org.apache.maven.artifact.DependencyResolutionRequiredException;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.compiler.util.Utils;
import org.bbqjs.mojo.RuntimeClasspathAwareMojo;
import org.codehaus.plexus.classworlds.realm.ClassRealm;

import java.io.File;
import java.io.FileFilter;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Copies image files into the webapp directory
 *
 * @author alex
 * @phase process-resources
 * @goal copyImages
 */
public class ImageCopierMojo extends RuntimeClasspathAwareMojo {

	/**
	 * Where the Image files live
	 *
	 * @parameter default-value="src/main/css"
	 * @required
	 */
	private File inputDirectory;

	/**
	 * Where the image files are to be stored
	 *
	 * @parameter default-value="${project.build.directory}/${project.build.finalName}/images"
	 * @required
	 */
	private File outputDirectory;

	/**
	 * A list of file extensions to copy into the output directory
	 *
	 * @parameter
	 */
	private String[] cssResourceExtensions;

	@Override
	public void execute() throws MojoExecutionException, MojoFailureException {
		super.execute();

		try {
			if(cssResourceExtensions == null || cssResourceExtensions.length == 0) {
				cssResourceExtensions = new String[]{
						".gif", ".png", ".jpg"
				};
			}

			// remove old output directory
			if (outputDirectory.exists()) {
				FileUtils.deleteDirectory(outputDirectory);
			}

			// ensure directory exists
			outputDirectory.mkdirs();

			getLog().debug("Copying CSS resources from " + inputDirectory + " to " + outputDirectory);

			// create filter list of files to copy
			List<IOFileFilter> filters = new ArrayList<IOFileFilter>();
			filters.add(DirectoryFileFilter.DIRECTORY);

			for (String extension : cssResourceExtensions) {
				filters.add(FileFilterUtils.suffixFileFilter(extension));

				getLog().debug("Inlcuding files with extension " + extension);
			}

			FileFilter filter = new OrFileFilter(filters);

			// copy files
			FileUtils.copyDirectory(inputDirectory, outputDirectory, filter);
		} catch (Exception e) {
			throw new MojoExecutionException("Could not copy CSS files", e);
		}
	}

	public void setInputDirectory(File inputDirectory) {
		this.inputDirectory = inputDirectory;
	}

	public void setOutputDirectory(File outputDirectory) {
		this.outputDirectory = outputDirectory;
	}

	public void setCssResourceExtensions(String[] cssResourceExtensions) {
		this.cssResourceExtensions = cssResourceExtensions;
	}
}
