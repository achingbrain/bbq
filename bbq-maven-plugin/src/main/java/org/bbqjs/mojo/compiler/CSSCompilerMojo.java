package org.bbqjs.mojo.compiler;

import java.io.File;
import java.io.FileFilter;
import java.util.List;
import java.util.ArrayList;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.DirectoryFileFilter;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.OrFileFilter;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.css.CSSCompiler;
import org.bbqjs.compiler.css.CompilableCSSFile;
import org.bbqjs.compiler.util.Utils;
import org.slf4j.Logger;

/**
 * Parses include statements in JavaScript files and generates single file
 * CSS files.
 * 
 * @author alex
 * 
 * @phase compile
 * @goal marinateCSS
 */
public class CSSCompilerMojo extends AbstractCompilerMojo {
	
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
		super.execute();
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
		Compiler compiler = new CSSCompiler(theme, libraries);
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
