package org.bbqjs.compiler.css;

import org.bbqjs.compiler.AbstractCompiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;

public class CSSCompiler extends AbstractCompiler<CompilableCSSFile> {
	private static Logger LOG = LoggerFactory.getLogger(CSSCompiler.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private String theme;
	private String jsDirectory;
	private String cssDirectory;
	
	public CSSCompiler(String theme, String[] libraries) {
		super(libraries);

		this.theme = theme;
		this.jsDirectory = getClass().getClassLoader().getResource(".").toString();
		this.cssDirectory = getClass().getClassLoader().getResource(".").toString();
	}

	@Override
	public void compile(URL inputFile, String packageName, OutputStream outputStream, String[] sourceRoots) throws IOException {
		String cssPath = inputFile.getPath().replaceAll(".js", "/style.css");
		cssPath = cssPath.replace(jsDirectory, cssDirectory);
		URL cssUrl = getClass().getClassLoader().getResource(cssPath);
		
		if(cssUrl == null) {
			File file = new File(cssPath);
			
			if(file.exists()) {
				cssUrl = file.toURI().toURL();
			}
		}
		
		LOG.debug("Will compile js: " + inputFile + " css: " + cssPath + " css url: " + cssUrl);
		
		compileToOutputStream(new CompilableCSSFile(inputFile, cssUrl, theme, sourceRoots), outputStream);
	}
}
