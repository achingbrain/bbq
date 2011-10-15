package org.bbqjs.compiler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.util.List;

public interface CompilableFile {
	public void writeTo(OutputStream outputStream) throws IOException;
	public List<CompilableFile> getIncludedFiles();
	public URL getFilePath();
}

