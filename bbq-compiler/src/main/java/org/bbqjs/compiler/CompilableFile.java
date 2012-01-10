package org.bbqjs.compiler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.util.List;

/**
 * I am a compilable file.  I can be compiled.
 */
public interface CompilableFile {
	/**
	 * Calling this method will cause the contents of the file to be written into the output stream.
	 *
	 * @param outputStream
	 * @throws IOException
	 */
	public void writeTo(OutputStream outputStream) throws IOException;

	/**
	 * Returns a list of files included by this source file.
	 *
	 * @return
	 */
	public List<CompilableFile> getIncludedFiles();

	/**
	 * Returns the path to this file.
	 *
	 * @return
	 */
	public URL getFilePath();
}

