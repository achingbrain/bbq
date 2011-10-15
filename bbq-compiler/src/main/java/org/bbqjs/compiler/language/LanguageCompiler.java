package org.bbqjs.compiler.language;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Properties;

import org.bbqjs.compiler.AbstractCompiler;
import org.bbqjs.compiler.CompilableFile;
import org.bbqjs.compiler.util.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LanguageCompiler extends AbstractCompiler<CompilableLanguageFile> {
	private static Logger LOG = LoggerFactory.getLogger(LanguageCompiler.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private String jsDirectory;
	private Locale locale;
	private Locale defaultLocale;
	
	public LanguageCompiler(Locale locale, Locale defaultLocale, String[] libraries) {
		super(libraries);

		this.jsDirectory = getClass().getClassLoader().getResource(".").toString();
		this.locale = locale;
		this.defaultLocale = defaultLocale;
	}
	
	@Override
	public void compile(URL javaScriptInputFile, String packageName, OutputStream outputStream, String[] sourceRoots) throws IOException {
		Properties properties = createProperties(javaScriptInputFile, sourceRoots);

		properties.storeToXML(outputStream, locale + " lanaguge translation");
	}

	public Properties createProperties(URL javaScriptInputFile, String[] sourceRoots) throws IOException {
		LOG.debug("Will compile " + javaScriptInputFile);

		String className = Utils.getJavaScriptClassName(javaScriptInputFile, jsDirectory);

		CompilableLanguageFile compilableFile = new CompilableLanguageFile(className, javaScriptInputFile, locale, defaultLocale, sourceRoots);
		List<CompilableLanguageFile> includedFiles = new ArrayList<CompilableLanguageFile>();

		// ensure files included by the compilation target are included
		parseInputFile(compilableFile, includedFiles);

		Properties properties = new Properties();

		if (libraries != null) {
			// if we've been given a shared language file(s), add it to the translation
			for (String path : libraries) {
				URL url = Utils.findFile(path, jsDirectory, locale, "lang.xml");

				if (url == null) {
					continue;
				}

				Properties library = new Properties();
				library.loadFromXML(url.openStream());

				for (Object key : library.keySet()) {
					properties.put(key, library.get(key));
				}
			}
		}

		for (CompilableFile included : includedFiles) {
			LanguageFile languageFile = (LanguageFile) included;
			Properties translation = languageFile.getLanguageTranslations();

			for (Object key : translation.keySet()) {
				properties.put(key, translation.get(key));
			}
		}

		LOG.debug("Language file has " + properties.keySet().size() + " translations");

		return properties;
	}
}
