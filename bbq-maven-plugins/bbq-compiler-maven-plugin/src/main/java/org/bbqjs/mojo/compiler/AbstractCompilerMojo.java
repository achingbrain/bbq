package org.bbqjs.mojo.compiler;

import java.io.File;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.compiler.util.Utils;
import org.bbqjs.mojo.RuntimeClasspathAwareMojo;

/**
 * Parses include statements in JavaScript files and generates single file
 * JavaScript and CSS files.
 * 
 * @author alex
 * @phase compile
 *
 */
public abstract class AbstractCompilerMojo extends RuntimeClasspathAwareMojo implements CompiliationThreadCompleteListener {
	private String[] sourceRoots;
	private Exception compilationException;
	protected int numExecutions;

	/**
	 * This method signature is rediculous.  Why?  Because Maven's plugin compiler interrogates JavaDoc
	 * style annotations in the comments of class fields to generate the parameters for a plugin instead of using
	 * Java5 style annotations, ostensibly to support versions of Java pre 2004.  This only seems
	 * to work properly if the class is in the same project.  IE. if you extend a class from a JAR, the annotations
	 * in the comments of that class do not get parsed so the parameter definition doesn't make it into the
	 * plugin.xml file.
	 *
	 * All this will change when https://cwiki.apache.org/confluence/display/MAVEN/Java+5+Annotations+for+Plugins
	 * is implemented and we can go back to using this kind of thing in a sane manner.
	 *
	 * @param project
	 * @param descriptor
	 * @param pagePackage
	 * @param inputDirectory
	 * @param sourceRoots
	 * @throws MojoExecutionException
	 * @throws MojoFailureException
	 */
	public void execute(MavenProject project, PluginDescriptor descriptor, String pagePackage, File inputDirectory, String[] sourceRoots) throws MojoExecutionException, MojoFailureException {
		super.execute(project, descriptor);

		this.sourceRoots = sourceRoots;

		if (pagePackage == null) {
			throw new MojoFailureException("Please specify a page package (eg. where your subclasses of bbq.page.Page live), usually by declaring a ${js.page.package} property in your pom.xml file.");
		}

		if(inputDirectory == null) {
			throw new MojoFailureException("Please specify an input directory, usually by declaring a ${js.page.package} property in your pom.xml file.");
		}

		if(!inputDirectory.exists()) {
			// replace package separator with path separator 
			inputDirectory = new File(inputDirectory.getPath().replaceAll("\\.", File.separator));

			if(!inputDirectory.exists()) {
				throw new MojoFailureException("Input directory " + inputDirectory.getPath() + " does not exist.");
			}
		}

		getLog().debug("Using input directory " + inputDirectory);

		numExecutions = 0;

		try {
			// ensure output directory exists
			if(!getOutputDirectory().exists()) {
				getOutputDirectory().mkdirs();
			}

			// look through input files and fire off a ThreadedFileMunger for each of them
			parseInputFiles(inputDirectory, pagePackage, getOutputDirectory());

			while(numExecutions > 0) {
				Thread.sleep(1000);

				if(compilationException != null) {
					throw compilationException;
				}
			}
		} catch(Exception e) {
			getLog().error(e);

			if(e.equals(compilationException)) {
				// this was the one that caused us to fail
				throw new MojoFailureException(e, "Failed to compile files", "");
			} else {
				// general exception?
				throw new MojoExecutionException("Exception thrown while compiling files", e);
			}
		}
	}

	
	/**
	 * Looks through input files and sets off file munger threads
	 * 
	 * @param directory
	 * @param outputDirectory
	 */
	private void parseInputFiles(File directory, String pagePackage, File outputDirectory) throws Exception {
		for(File file : directory.listFiles()) {
			if(file.isHidden()) {
				continue;
			}

			if(file.isDirectory()) {
				// create output directory
				File dir = new File(outputDirectory.getAbsolutePath() + File.separator + file.getName());

				if(!dir.exists()) {
					dir.mkdirs();
				}

				// descend into directory
				parseInputFiles(file, pagePackage + "." + file.getName(), new File(outputDirectory.getAbsolutePath() + File.separator + file.getName()));
			} else {
				if(!file.getPath().endsWith(".js")) {
					continue;
				}

				encounteredFileCandidateForCompilation(file, pagePackage, sourceRoots);
			}
		}
	}

	protected void encounteredFileCandidateForCompilation(File file, String pagePackage, String[] sourceRoots) throws Exception {
		// parse page file
		String fileName = Utils.fileNameWithoutExtension(file);

		File output = new File(getOutputDirectory() + File.separator + fileName + "." + getOutputExtension());

		Runnable thread = encounteredCompilableFile(file, pagePackage, output, sourceRoots);

		if(thread == null) {
			return;
		}

		numExecutions++;

		getLog().debug("Starting compiler thread - now " + numExecutions);

		new Thread(thread).start();
	}

	@Override
	public synchronized void doneExecuting(CompilerThread t) {
		numExecutions--;

		getLog().debug("Compiler thread finished - now " + numExecutions);
	}

	@Override
	public synchronized void failedExecuting(CompilerThread t, Exception e) {
		compilationException = e;

		doneExecuting(t);
	}

	protected abstract Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, String[] sourceRoots) throws Exception;
	protected abstract String getOutputExtension();
	protected abstract File getOutputDirectory();
}
