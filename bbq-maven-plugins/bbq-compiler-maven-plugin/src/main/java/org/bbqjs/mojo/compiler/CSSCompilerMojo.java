package org.bbqjs.mojo.compiler;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.css.CSSCompiler;
import org.bbqjs.compiler.css.CompilableCSSFile;
import org.bbqjs.compiler.util.Utils;
import org.bbqjs.mojo.MojoLogger;
import org.slf4j.Logger;

import java.io.File;

/**
 * Parses include statements in JavaScript files and generates single file
 * CSS files.
 * 
 * @author alex
 *
 * @goal compileCSS
 * @phase compile
 * @threadSafe
 * @requiresDependencyResolution compile
 * @configurator include-project-dependencies
 */
public class CSSCompilerMojo extends AbstractCompilerMojo {

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
	 * A list of theme names, if supported.  Themes should be directories under $cssDirectory.
	 * 
	 * So if you had the following directory structure:
	 * 
	 * <pre>
	 * src/main/css/blueTheme
	 * src/main/css/redTheme
	 * </pre>
	 * 
	 * You'd use:
	 * 
	 * <code>
	 * <themes>
	 * 		<theme>blueTheme</theme>
	 * 		<theme>redTheme</theme>
	 * </themes>
	 * </code>
	 * 
	 * @parameter
	 */
	public String[] themes;

	/**
	 * Where the CSS files are to be stored
	 * 
	 * @parameter default-value="src/main/webapp/styles"
	 * @required
	 */
	protected File outputDirectory;

	@Override
	public void execute() throws MojoExecutionException, MojoFailureException {
		// enable mojo friendly SLF4J logging
		Logger log = new MojoLogger(getLog());
		CSSCompiler.setLogger(log);
		AbstractCompilableFile.setLogger(log);
		CompilableCSSFile.setLogger(log);
		CompilerThread.setLogger(log);

		// proceed with execution
		super.execute(project, descriptor, pagePackage, inputDirectory, sourceRoots);
	}

	@Override
	protected void encounteredFileCandidateForCompilation(File file, String pagePackage, String[] sourceRoots) throws Exception {
		if(themes != null && themes.length > 0) {
			for(String theme : themes) {
				// parse page file
				String fileName = Utils.fileNameWithoutExtension(file);

				File output = new File(outputDirectory + File.separator + theme + File.separator + fileName + "." + getOutputExtension());

				Runnable thread = encounteredCompilableFile(file, pagePackage, output, theme, sourceRoots);

				if(thread == null) {
					continue;
				}

				numExecutions++;
				new Thread(thread).start();
			}
		} else {
			// parse page file
			String fileName = Utils.fileNameWithoutExtension(file);

			File output = new File(outputDirectory + File.separator + fileName + "." + getOutputExtension());

			Runnable thread = encounteredCompilableFile(file, pagePackage, output, null, sourceRoots);

			if(thread == null) {
				return;
			}

			numExecutions++;
			new Thread(thread).start();
		}
	}

	protected Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, String theme, String[] sourceRoots) throws Exception {
		Compiler compiler = new CSSCompiler(theme, includes);
		Runnable thread = new CompilerThread(compiler, inputFile, pagePackage, outputFile, this, sourceRoots);
		
		getLog().debug("Setting up CSSCompiler - input file: " + inputFile.getAbsolutePath() + " output file: " + outputFile.getAbsolutePath());
		
		return thread;
	}

	@Override
	protected Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, String[] sourceRoots) throws Exception {
		throw new UnsupportedOperationException("Please pass a theme to encounteredCompilableFile");
	}

	@Override
	protected String getOutputExtension() {
		return "css";
	}

	@Override
	protected File getOutputDirectory() {
		return outputDirectory;
	}
}
