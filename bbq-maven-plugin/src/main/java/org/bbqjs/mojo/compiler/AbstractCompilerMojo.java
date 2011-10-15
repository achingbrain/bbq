package org.bbqjs.mojo.compiler;

import java.io.File;
import java.net.MalformedURLException;
import java.util.List;

import org.apache.maven.artifact.DependencyResolutionRequiredException;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.bbqjs.compiler.util.Utils;
import org.bbqjs.mojo.RuntimeClasspathAwareMojo;
import org.codehaus.plexus.classworlds.realm.ClassRealm;

/**
 * Parses include statements in JavaScript files and generates single file
 * JavaScript and CSS files.
 * 
 * @author alex
 * @phase compile
 *
 */
public abstract class AbstractCompilerMojo extends RuntimeClasspathAwareMojo implements CompiliationThreadCompleteListener {
	/**
	 * The directory containing the JavaScript Page objects that make 
	 * up this application
	 * 
	 * @parameter default-value="src/main/javascript/${js.page.package}"
	 * @required
	 */
	protected File inputDirectory;

	/**
	 * The directory containing the JavaScript Page objects that make
	 * up this application
	 *
	 * @parameter default-value="${js.page.package}"
	 * @required
	 */
	protected String pagePackage;

	/**
	 * Arbitrary files that will be tacked on to the beginning of the output file.
	 * Use this for any shared libraries you want including.
	 *
	 * @parameter
	 */
	protected String[] libraries;

	/**
	 * @parameter
	 */
	protected String[] sourceRoots;

	protected int numExecutions;
	private Exception compilationException;

	@Override
	public void execute() throws MojoExecutionException, MojoFailureException {
		super.execute();

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
