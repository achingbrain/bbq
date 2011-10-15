package org.bbqjs.spring.mvc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.*;

/**
 * Serves maps of language files.
 */
@Controller
public class LanguageController implements ServletContextAware {
	private static final Logger LOG = LoggerFactory.getLogger(LanguageController.class);
	private List<Locale>supportedLocales;
	private Locale defaultLocale;
	private ServletContext servletContext;

	public List<Locale> getSupportedLocales() {
		return supportedLocales;
	}

	public void setSupportedLocales(List<Locale> supportedLocales) {
		this.supportedLocales = supportedLocales;
	}

	public Locale getDefaultLocale() {
		return defaultLocale;
	}

	public void setDefaultLocale(Locale defaultLocale) {
		this.defaultLocale = defaultLocale;
	}

	@RequestMapping(value="/backend/getLanguage", method=RequestMethod.POST)
	public @ResponseBody Map<Object, Object> getLanguagePost(@RequestBody LanguageRequest request, HttpServletResponse response, Locale locale) throws IOException {
		if(!supportedLocales.contains(locale)) {
			locale = defaultLocale;
		}
		
		return getLanguageFile(request.getSection(), locale);
	}
	
	protected Map<Object, Object> getLanguageFile(Object byName, Locale forLocale) throws IOException {
		InputStream stream = servletContext.getResourceAsStream("/WEB-INF/language/" + byName + "_" + forLocale.getLanguage() + "_" + forLocale.getCountry() + ".xml");

		if(stream == null) {
			return new HashMap<Object, Object>();
		}

		Properties properties = new Properties();
		properties.loadFromXML(stream);

		LOG.debug("loaded " + properties);

		return properties;
	}

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
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
