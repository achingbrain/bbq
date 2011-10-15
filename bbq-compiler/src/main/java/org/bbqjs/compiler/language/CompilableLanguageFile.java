package org.bbqjs.compiler.language;

import org.bbqjs.compiler.AbstractCompilableFile;
import org.bbqjs.compiler.css.CompilableCSSFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Locale;
import java.util.Properties;

public class CompilableLanguageFile extends AbstractCompilableFile implements LanguageFile {
	private static Logger LOG = LoggerFactory.getLogger(CompilableCSSFile.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private String className;
	private URL javaScriptFile;
	private Locale locale;
	private Locale defaultLocale;
	
	public CompilableLanguageFile(String className, URL javaScriptInputFile, Locale locale, Locale defaultLocale, String[] sourceRoots) throws IOException {
		super(javaScriptInputFile, sourceRoots);
		
		this.className = className;
		this.javaScriptFile = javaScriptInputFile;
		this.locale = locale;
		this.defaultLocale = defaultLocale;
		
		findIncludes(javaScriptInputFile);
	}
	
	@Override
	protected void encounteredInclude(String className, URL javaScriptFile) throws IOException {
		includedFiles.add(new CompilableLanguageFile(className, javaScriptFile, locale, defaultLocale, sourceRoots));
	}
	
	@Override
	public Properties getLanguageTranslations() throws IOException {
		// try specific language - e.g. en_GB
		URL url = findResource(className, locale);
		
		if(url == null) {
			// try vague language - e.g. en
			Locale vagueLocale = new Locale(locale.getLanguage());
			url = findResource(className, vagueLocale);
		}
		
		if(url == null && defaultLocale != null) {
			// fall back to default locale
			url = findResource(className, defaultLocale);
		}
		
		if(url == null) {
			return new Properties();
		}
		
		Properties properties = new Properties();
		properties.loadFromXML(url.openStream());
		
		return properties;
	}
	
	protected URL findResource(String className, Locale locale) throws IOException {
		URL url = loadFromFile(className, locale);
		
		if(url == null) {
			url = loadFromClassPath(className, locale);
		}
		
		return url;
	}
	
	protected URL loadFromClassPath(String className, Locale locale) {
		String path = className.replaceAll("\\.", "/") + "." + locale + ".lang.xml";
		
		LOG.debug("Tring to load " + path + " from classpath");
		
		return getClass().getClassLoader().getResource(path);
	}
	
	protected URL loadFromFile(String className, Locale locale) throws IOException {
		// decode url to turn %20 into spaces
		String path = URLDecoder.decode(javaScriptFile.toString(), "UTF-8");
		
		if(path.endsWith(".js")) {
			path = path.substring(0, path.length() - 3);
		}
		
		File languageFile = new File(path.replaceAll("file:", "").replaceAll("jar:", "") + "." + locale + ".lang.xml");
		
		// try with locale
		if(!languageFile.exists()) {
			LOG.debug("Could not find language file at " + languageFile + " for js file " + path);
			
			// try without locale
			languageFile = new File(path + "." + locale + ".lang.xml");
			
			if(!languageFile.exists()) {
				LOG.debug("Still could not find language file at " + languageFile + " for js file " + path);
				
				return null;
			}
		}
		
		return languageFile.toURI().toURL();
	}
	
	@Override
	public void writeTo(OutputStream outputStream) throws IOException {
		throw new UnsupportedOperationException("Please call getLanguageTranslations instead of writeTo for language files.");
	}
}
