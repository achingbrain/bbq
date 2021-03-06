package org.bbqjs.mojo.compiler;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.language.CompilableLanguageFile;
import org.bbqjs.compiler.language.LanguageCompiler;
import org.bbqjs.compiler.util.Utils;
import org.bbqjs.mojo.MojoLogger;
import org.slf4j.Logger;

import java.io.File;
import java.util.Locale;

/**
 * Parses include statements in JavaScript files and generates single file
 * language files.
 * 
 * @author alex
 *
 * @goal compileLanguage
 * @phase compile
 * @threadSafe
 * @requiresDependencyResolution compile
 * @configurator include-project-dependencies
 */
public class LanguageCompilerMojo extends AbstractCompilerMojo {
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
	 * A list of supported languages specified as Locale codes.
	 * 
	 * Eg:  [en_GB, en_US, en]
	 * 
	 * @parameter
	 * @required
	 */
	private String[] supportedLanguages;

	/**
	 * A fallback Locale code.
	 * 
	 * Eg:  [en_GB, en_US, en]
	 * 
	 * @parameter
	 * @required
	 */
	private String defaultLanguage;

	/**
	 * If true warnings will be issued if translation strings are not used.
	 * 
	 * @parameter default-value="false"
	 */
	private boolean reportRedundantStrings;

	/**
	 * Where the files are to be stored
	 * 
	 * @parameter default-value="src/main/webapp/WEB-INF/language"
	 */
	private File outputDirectory;

	@Override
	public void execute() throws MojoExecutionException, MojoFailureException {
		// enable mojo friendly SLF4J logging
		Logger log = new MojoLogger(getLog());
		LanguageCompiler.setLogger(log);
		AbstractCompilableFile.setLogger(log);
		CompilableLanguageFile.setLogger(log);
		CompilerThread.setLogger(log);

		// proceed with execution
		super.execute(project, descriptor, pagePackage, inputDirectory, sourceRoots);
	}

	@Override
	protected void encounteredFileCandidateForCompilation(File file, String pagePackage, String[] sourceRoots) throws Exception {
		Locale defaultLocale = null;

		if(defaultLanguage != null) {
			defaultLocale = getLocale(defaultLanguage);
		}

		for(String localeString : supportedLanguages) {
			Locale locale = getLocale(localeString);

			// parse page file
			String fileName = Utils.fileNameWithoutExtension(file);

			File output = new File(outputDirectory + File.separator + fileName + "_" + getOutputExtension(locale));

			Runnable thread = encounteredCompilableFile(file, pagePackage, output, locale, defaultLocale, sourceRoots);

			if(thread == null) {
				continue;
			}

			numExecutions++;
			new Thread(thread).start();
		}
	}

	protected Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, Locale locale, Locale defaultLocale, String[] sourceRoots) throws Exception {
		Compiler compiler = new LanguageCompiler(locale, defaultLocale, includes);
		Runnable thread = new CompilerThread(compiler, inputFile, pagePackage, outputFile, this, sourceRoots);

		getLog().debug("Setting up LanguageCompiler - input file: " + inputFile.getAbsolutePath() + " output file: " + outputFile.getAbsolutePath());

		return thread;
	}

	protected String getOutputExtension(Locale locale) {
		return locale.getLanguage() + "_" + locale.getCountry() + ".xml";
	}

	@Override
	public void doneExecuting(CompilerThread t) {
		super.doneExecuting(t);

		if(reportRedundantStrings) {
			/*try {
				CompiledJavaScriptFile compiledFile = new CompiledJavaScriptFile(t.getInputFile());
				
				Properties properties = new Properties();
				properties.loadFromXML(new FileInputStream(t.getOutputFile()));
				
				for(Object key : properties.keySet()) {
					compiledFile.contains(key);
				}
			} catch(Exception e) {
				throw new RuntimeException("Could not report redundant strings", e);
			}*/
		}
	}

	@Override
	protected Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, String[] sourceRoots) throws Exception {
		throw new UnsupportedOperationException("Please pass a locale to encounteredCompilableFile");
	}

	@Override
	protected String getOutputExtension() {
		throw new UnsupportedOperationException("Please pass a locale to getOutputExtension");
	}

	@Override
	protected File getOutputDirectory() {
		return outputDirectory;
	}

	private Locale getLocale(String string) throws MojoFailureException {
		String[] parts = string.split("_");

		if(parts.length == 2) {
			return new Locale(parts[0], parts[1]);
		} else if (parts.length == 1) {
			return new Locale(parts[0]);
		}

		throw new MojoFailureException("Could not convert " + string + " to Locale"); 
	}
}
