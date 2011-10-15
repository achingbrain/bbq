package org.bbqjs.compiler;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

import org.bbqjs.compiler.exceptions.ClassFileNotFoundException;
import org.bbqjs.compiler.exceptions.CompilationFailureException;
import org.bbqjs.compiler.util.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Interrogates passed JavaScript files for their include statements.  It's recommended that include statements
 * are at the top of the file but it's not essential.  Whitespace between include lines is ignored.
 * 
 * <code>
 * 
 * include(org.my.project.JSClass);
 * include(org.my.project.AnotherJSClass);
 * include(org.some.other.project.YetAnotherJSClass);
 * 
 * org.my.namespace.MyClass = Class.create({
 * 		...
 * });
 * 
 * </code>
 * 
 * @author alex
 *
 */
public abstract class AbstractCompilableFile implements CompilableFile {
	private static Logger LOG = LoggerFactory.getLogger(AbstractCompilableFile.class);

	public static void setLogger(Logger log) {
		LOG = log;
	}

	/**
	 * Holds contents of file after includes
	 */
	protected ByteArrayOutputStream contents;
	
	/**
	 * List of files included by this file
	 */
	protected List<CompilableFile> includedFiles;
	
	private URL filePath;

	/**
	 * Java by default caches everything accessed via the classpath - this is fine for
	 * production, but if we are developing it means, for example, that if you are changing
	 * js/css files, the compiler servlets in the spring integration package will not be
	 * able to pick up your changes.  This property is a list of filesystem locations that
	 * we should try to pull files from before using the classpath - ie. your src/main/javascript
	 * folder and the like.
	 */
	protected String[] sourceRoots;
	
	public AbstractCompilableFile(URL filePath, String[] sourceRoots) {
		this.contents = new ByteArrayOutputStream();
		this.filePath = filePath;
		this.includedFiles = new ArrayList<CompilableFile>();
		this.sourceRoots = sourceRoots;

		if(this.sourceRoots == null) {
			this.sourceRoots = new String[0];
		}
	}
	
	protected void findIncludes(URL file) throws IOException {
		try {
			InputStream inputStream = file.openStream();
			InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
			BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
			String line;
			
			while((line = bufferedReader.readLine()) != null){
				String trimmed = line.trim();
				
				if(trimmed.startsWith("include(")) {
					String className = trimmed.replaceAll("include\\(", "").replaceAll("\\);", "");
					
					// notify any subclasses
					encounteredInclude(className);
				} else {
					contents.write((line + "\r\n").getBytes());
				}
			}
			
			bufferedReader.close();
			inputStreamReader.close();
			inputStream.close();
		} catch(Exception e) {
			throw new CompilationFailureException(e);
		}
	}
	
	protected void encounteredInclude(String className) throws IOException {
		String path = className.replaceAll("\\.", "/") + ".js";

		URL url = Utils.findFile(path, sourceRoots);
		
		if(url == null) {
			LOG.error("Could not find JavaScript file for class " + className + " with path " + path + " on classpath");
			LOG.error("Executing in directory " + new File(".").getAbsolutePath());
			LOG.error("Resource directory " + getClass().getClassLoader().getResource("."));

			ClassLoader loader = Thread.currentThread().getContextClassLoader();

			Enumeration<URL> urls = loader.getSystemResources(path);

			LOG.error("Loader " + loader);
			LOG.error("Resource enumeration " + urls);
			LOG.error("Resource enumeration has more " + urls.hasMoreElements());
			LOG.error("Resource more " + loader.getSystemResource(path));

			throw new ClassFileNotFoundException("Could not find JavaScript file for class " + className + " with path " + path + " on classpath");
		}

		encounteredInclude(className, url);
	}

	protected void encounteredInclude(String className, URL javaScriptFile) throws IOException {
		
	}
	
	@Override
	public void writeTo(OutputStream outputStream) throws IOException {
		contents.writeTo(outputStream);
	}
	
	@Override
	public URL getFilePath() {
		return filePath;
	}
	
	@Override
	public List<CompilableFile> getIncludedFiles() {
		return includedFiles;
	}
	
	@Override
	public boolean equals(Object file) {
		if(file instanceof AbstractCompilableFile) {
			AbstractCompilableFile abstractMungedFile = (AbstractCompilableFile)file;
			
			return abstractMungedFile.getFilePath().equals(getFilePath());
		}
		
		return false;
	}
	
	@Override
	public String toString() {
		return filePath.toString();
	}
}
