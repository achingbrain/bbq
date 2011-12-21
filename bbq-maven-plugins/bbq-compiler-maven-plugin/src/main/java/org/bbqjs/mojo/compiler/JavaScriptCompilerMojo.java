package org.bbqjs.mojo.compiler;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.javascript.CompilableJavaScriptFile;
import org.bbqjs.compiler.javascript.JavaScriptCompiler;
import org.bbqjs.mojo.MojoLogger;
import org.slf4j.Logger;

import java.io.File;

/**
 * Parses include statements in JavaScript files and generates single file
 * JavaScript files.
 * 
 * @author alex
 *
 * @goal compileJavaScript
 * @phase compile
 * @threadSafe
 * @requiresDependencyResolution compile
 * @configurator include-project-dependencies
 */
public class JavaScriptCompilerMojo extends AbstractCompilerMojo {

	/**
	 * The directory containing the JavaScript Page objects that make
	 * up this application
	 *
	 * @parameter default-value="src/main/javascript/${js.page.package}"
	 * @required
	 */
	private File inputDirectory;

	/**
	 * The directory containing the JavaScript Page objects that make
	 * up this application
	 *
	 * @parameter default-value="${js.page.package}"
	 * @required
	 */
	private String pagePackage;

	/**
	 * Arbitrary files that will be tacked on to the beginning of the output file.
	 * Use this for any shared libraries you want including.
	 *
	 * @parameter
	 */
	private String[] includes;

	/**
	 * Locations in which to search for files to include - these are filesystem locations
	 * that will be checked before the classpath
	 *
	 * @parameter
	 */
	private String[] sourceRoots;

	/**
	 * @parameter expression="${project}"
	 * @required
	 * @readonly
	 */
	private MavenProject project;

	/**
	 * Plugin descriptor.
	 *
	 * @parameter default-value="${plugin}"
	 * @required
	 * @readonly
	 */
	private PluginDescriptor descriptor;

	/**
	 * Where the files are to be stored
	 * 
	 * @parameter default-value="src/main/webapp/javascript"
	 * @required
	 */
	private File outputDirectory;

	@Override
	public void execute() throws MojoExecutionException, MojoFailureException {
		// enable mojo friendly SLF4J logging
		Logger log = new MojoLogger(getLog());
		JavaScriptCompiler.setLogger(log);
		AbstractCompilableFile.setLogger(log);
		CompilableJavaScriptFile.setLogger(log);
		CompilerThread.setLogger(log);

		// proceed with execution
		super.execute(project, descriptor, pagePackage, inputDirectory, sourceRoots);
	}

	@Override
	protected Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, String[] sourceRoots) throws Exception {
		Compiler compiler = new JavaScriptCompiler(includes);
		Runnable thread = new CompilerThread(compiler, inputFile, pagePackage, outputFile, this, sourceRoots);

		getLog().debug("Setting up JavaScriptCompiler - input file: " + inputFile.getAbsolutePath() + " output file: " + outputFile.getAbsolutePath());

		return thread;
	}

	@Override
	protected String getOutputExtension() {
		return "js";
	}

	@Override
	protected File getOutputDirectory() {
		return outputDirectory;
	}
}
