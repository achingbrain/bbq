package org.bbqjs.spring.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.*;

/**
 * Serves maps of language files.
 */
@Controller
public class LanguageController implements ServletContextAware {
	private List<Locale>supportedLocales;
	private Locale defaultLocale;
	private ServletContext servletContext;
	private String languageFilesLocation = "/WEB-INF/language/";

	@RequestMapping(value="/language/get", method=RequestMethod.POST)
	public @ResponseBody Map<Object, Object> getLanguage(@RequestBody LanguageRequest request, Locale locale) throws IOException {
		if(!supportedLocales.contains(locale)) {
			locale = defaultLocale;
		}

		return getLanguageFile(request.getSection(), locale);
	}

	protected Map<Object, Object> getLanguageFile(Object byName, Locale forLocale) throws IOException {
		InputStream stream = servletContext.getResourceAsStream(languageFilesLocation + byName + "_" + forLocale.getLanguage() + "_" + forLocale.getCountry() + ".xml");

		if(stream == null) {
			return Collections.EMPTY_MAP;
		}

		Properties properties = new Properties();
		properties.loadFromXML(stream);

		return properties;
	}

	public void setSupportedLocales(List<Locale> supportedLocales) {
		this.supportedLocales = supportedLocales;
	}

	public void setDefaultLocale(Locale defaultLocale) {
		this.defaultLocale = defaultLocale;
	}

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	public void setLanguageFilesLocation(String languageFilesLocation) {
		this.languageFilesLocation = languageFilesLocation;

		if(!this.languageFilesLocation.endsWith(File.separator)) {
			this.languageFilesLocation += File.separator;
		}
	}

	public static class LanguageRequest implements Serializable {
		private static final long serialVersionUID = 2889445903996689890L;
		private String section;

		public String getSection() {
			return section;
		}

		public void setSection(String section) {
			this.section = section;
		}
	}
}
