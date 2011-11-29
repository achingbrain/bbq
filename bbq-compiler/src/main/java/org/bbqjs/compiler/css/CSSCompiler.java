package org.bbqjs.compiler.css;

import org.bbqjs.compiler.AbstractCompiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
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
		this.jsDirectory = getClass().getClassLoader().getResource(".").toString().replace("file:", "");
		this.cssDirectory = getClass().getClassLoader().getResource(".").toString().replace("file:", "");
	}

	@Override
	public void compile(URL inputFile, String packageName, OutputStream outputStream, String[] sourceRoots) throws IOException {
		// try style.css in the directory
		URL cssUrl = findFile(inputFile,  "style.css");

		if(cssUrl == null) {
			// try ClassName.css in the directory
			String[] parts = inputFile.toString().split("/");
			String jsClassName = parts[parts.length - 1];
			jsClassName = jsClassName.replaceAll(".js", ".css");

			cssUrl = findFile(inputFile, jsClassName);
		}

		LOG.debug("Will compile js: " + inputFile + " css url: " + cssUrl);

		compileToOutputStream(new CompilableCSSFile(inputFile, cssUrl, theme, sourceRoots), outputStream);
	}

	protected URL findFile(URL inputFile, String fileName) throws MalformedURLException {
		String cssPath = inputFile.getPath().replaceAll(".js", "/" + fileName);
		cssPath = cssPath.replace(jsDirectory, cssDirectory + (theme != null ? theme + File.separator : ""));
		URL cssUrl = getClass().getClassLoader().getResource(cssPath);

		if (cssUrl == null) {
			File file = new File(cssPath);

			if (file.exists()) {
				cssUrl = file.toURI().toURL();
			}
		}

		return cssUrl;
	}
}
