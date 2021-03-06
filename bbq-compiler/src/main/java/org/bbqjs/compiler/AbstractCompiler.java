package org.bbqjs.compiler;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractCompiler<C extends CompilableFile> implements Compiler {
	private static final Logger LOG = LoggerFactory.getLogger(AbstractCompiler.class);

	protected String[] libraries;

	public AbstractCompiler(String[] libraries) {
		this.libraries = libraries;
	}

	/**
	 * @inheritdoc
	 * @param inputFile
	 * @param packageName
	 * @param sourceRoots
	 * @return
	 */
	@Override
	public String compile(URL inputFile, String packageName, String[] sourceRoots) {
		LOG.debug("Compiler using " + inputFile + " as input");

		OutputStream outputStream = new ByteArrayOutputStream();

		try {
			compile(inputFile, packageName, outputStream, sourceRoots);
		} catch(IOException e) {
			LOG.error("Could not compile input file " + inputFile, e);

			throw new RuntimeException(e);
		}

		return outputStream.toString();
	}

	/**
	 * Writes the target file and all files included by the target file into the output stream
	 *
	 * @param target
	 * @param outputStream
	 * @throws IOException
	 */
	protected void compileToOutputStream(C target, OutputStream outputStream) throws IOException {
		List<C> includedFiles = new ArrayList<C>();
		
		LOG.debug("Going to compile " + target.getFilePath());
		
		// ensure files included by the compilation target are included
		parseInputFile(target, includedFiles);
		
		writeToOutputStream(includedFiles, outputStream);
	}

	/**
	 * Will write the list of files out into the passed output stream, along with any libraries
	 * that have been requested to be included.
	 *
	 * @param includedFiles
	 * @param outputStream
	 * @throws IOException
	 */
	protected void writeToOutputStream(List<C> includedFiles, OutputStream outputStream) throws IOException {
		if(libraries != null) {
			// if we've been given libraries, write them into the output stream
			for(String library : libraries) {
				URL url;
				File file = new File(library);

				if(file.exists()) {
					// library is path on filesystem
					url = file.toURI().toURL();
				} else {
					// library is on classpath
					url = getClass().getClassLoader().getResource(library);
				}

				if(url == null) {
					throw new IOException("Could not load resource for library " + library + " from file system or classpath.");
				}

				InputStream inputStream = url.openStream();
				IOUtils.copy(inputStream, outputStream);
				outputStream.write("\r\n".getBytes());
			}
		}

		afterWrittenLibrariesToOutputStream(includedFiles, outputStream);

		for(C included : includedFiles) {
			included.writeTo(outputStream);
			outputStream.write("\r\n".getBytes());
		}
	}

	/**
	 * Override this method to perform any post processing or cleanup.
	 *
	 * @param includedFiles
	 * @param outputStream
	 * @throws IOException
	 */
	protected void afterWrittenLibrariesToOutputStream(List<C> includedFiles, OutputStream outputStream) throws IOException {

	}

	/**
	 * Gets the passed CompilableFile to tell us which files it expects to include and
	 * recursively adds the include file to the list of files to write into the output stream
	 * @param file
	 */
	@SuppressWarnings("unchecked")
	protected void parseInputFile(C file, List<C> includedFiles) {
		// don't include the same file twice
		if(includedFiles.contains(file)) {
			return;
		}

		// add all files included by the passed file to the list
		for(CompilableFile include : file.getIncludedFiles()) {
			parseInputFile((C)include, includedFiles);
		}

		LOG.debug("Adding " + file.getFilePath() + " to list of files to compile");

		// add the passed file to the list
		includedFiles.add(file);
	}
}
