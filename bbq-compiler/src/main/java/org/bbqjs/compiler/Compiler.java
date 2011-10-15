package org.bbqjs.compiler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;

public interface Compiler {
	/**
	 * Returns a string of the compiled source of the given input file.  Not terribly 
	 * performant but useful sometimes.
	 * 
	 * @param inputFile
	 * @param packageName
	 * @return
	 */
	public String compile(URL inputFile, String packageName, String[] sourceRoots);
	
	/**
	 * Writes the compiled form of the input file into the passed output stream.
	 * 
	 * @param inputFile
	 * @param packageName
	 * @param outputStream
	 */
	public void compile(URL inputFile, String packageName, OutputStream outputStream, String[] sourceRoots) throws IOException;
}
