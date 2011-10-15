package org.bbqjs.mojo.compiler;

import java.io.File;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.AbstractCompiler;
import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.javascript.CompilableJavaScriptFile;
import org.bbqjs.compiler.javascript.JavaScriptCompiler;
import org.slf4j.Logger;

/**
 * Parses include statements in JavaScript files and generates single file
 * JavaScript files.
 * 
 * @author alex
 * 
 * @phase compile
 * @goal marinateJS
 */
public class JavaScriptCompilerMojo extends AbstractCompilerMojo {
	
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
		super.execute();
	}
	
	@Override
	protected Runnable encounteredCompilableFile(File inputFile, String pagePackage, File outputFile, String[] sourceRoots) throws Exception {
		Compiler compiler = new JavaScriptCompiler(libraries);
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
