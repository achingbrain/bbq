package org.bbqjs.mojo.compiler;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

import org.apache.commons.io.IOUtils;
import org.bbqjs.compiler.Compiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CompilerThread implements Runnable {
	private static Logger LOG = LoggerFactory.getLogger(CompilerThread.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private Compiler compiler;
	private File inputFile;
	private String pagePackage;
	private File outputFile;
	private CompiliationThreadCompleteListener interestedParty;
	private String[] sourceRoots;
	
	public CompilerThread(Compiler compiler, File inputFile, String pagePackage, File outputFile, CompiliationThreadCompleteListener interestedParty, String[] sourceRoots) {
		this.compiler = compiler;
		this.inputFile = inputFile;
		this.pagePackage = pagePackage;
		this.outputFile = outputFile;
		this.interestedParty = interestedParty;
		this.sourceRoots = sourceRoots;
	}
	
	@Override
	public void run() {
		try {
			if(!outputFile.exists()) {
				LOG.debug("Output file " + outputFile.getAbsolutePath() + " does not exist");
				
				String[] path = outputFile.getAbsolutePath().split("" + IOUtils.DIR_SEPARATOR);
				String outputFileDirectoryPath = "";
				
				for(int i = 0; i < path.length - 1; i++) {
					outputFileDirectoryPath += path[i] + IOUtils.DIR_SEPARATOR;
				}
				
				File outputFileDirectory = new File(outputFileDirectoryPath);
				
				LOG.debug("Ensuring directory exists at " + outputFileDirectory.getAbsolutePath());
				
				outputFileDirectory.mkdirs();
				
				LOG.debug("Creating output file at " + outputFile.getAbsolutePath());
				outputFile.createNewFile();
			}
			
			OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(outputFile));
			
			LOG.debug("Compiling " + inputFile.getAbsolutePath() + " to " + outputFile.getAbsolutePath());
			
			compiler.compile(inputFile.toURI().toURL(), pagePackage, outputStream, sourceRoots);
			
			outputStream.flush();
			outputStream.close();
			
			interestedParty.doneExecuting(this);
		} catch(Exception e) {
			interestedParty.failedExecuting(this, e);
		}
	}
	
	public File getInputFile() {
		return inputFile;
	}
	
	public File getOutputFile() {
		return outputFile;
	}
}
