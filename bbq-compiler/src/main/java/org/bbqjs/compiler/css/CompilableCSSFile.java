package org.bbqjs.compiler.css;

import org.apache.commons.io.IOUtils;
import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.util.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

public class CompilableCSSFile extends AbstractCompilableFile {
	private static Logger LOG = LoggerFactory.getLogger(CompilableCSSFile.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private URL cssFile;
	private String theme;
	
	public CompilableCSSFile(URL javaScriptInputFile, URL cssFile, String theme, String[] sourceRoots) throws IOException {
		super(javaScriptInputFile, sourceRoots);
		
		this.cssFile = cssFile;
		this.theme = theme;

		findIncludes(javaScriptInputFile);
	}
	
	@Override
	protected void encounteredInclude(String className, URL javaScriptFile) throws IOException {
		String path = (theme == null ? "" : (theme + "/")) + className.replaceAll("\\.", "/") + "/style.css";

		URL url = Utils.findFile(path, sourceRoots);
		
		LOG.debug("Including file " + javaScriptFile + ", css " + url);
		
		includedFiles.add(new CompilableCSSFile(javaScriptFile, url, theme, sourceRoots));
	}

	@Override
	public void writeTo(OutputStream outputStream) throws IOException {
		if(cssFile == null) {
			return;
		}
		
		InputStream cssStream = cssFile.openStream();
		
		IOUtils.copy(cssStream, outputStream);
		
		cssStream.close();
	}
}
