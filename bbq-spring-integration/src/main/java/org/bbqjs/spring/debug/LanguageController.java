package org.bbqjs.spring.debug;

import org.bbqjs.compiler.language.LanguageCompiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.net.URL;
import java.util.*;

/**
 * A version of the LanguageController meant for development.  Attempts to dynamically
 * create the language file for every request - not recommended for production.
 */
@Controller
public class LanguageController {
	private static final Logger LOG = LoggerFactory.getLogger(LanguageController.class);
	private List<Locale> supportedLocales;
	private Locale defaultLocale;
	private String[] sourceRoots;
	private String pagePackage;

	@RequestMapping(value = "/backend/getLanguage", method = RequestMethod.POST)
	public @ResponseBody Map<Object, Object> getLanguagePost(@RequestBody LanguageRequest request, HttpServletResponse response, Locale locale) throws IOException {
		if (!supportedLocales.contains(locale)) {
			locale = defaultLocale;
		}

		return getLanguageFile(request.getSection(), locale);
	}

	protected Map<Object, Object> getLanguageFile(Object byName, Locale forLocale) throws IOException {
		String resource = pagePackage.replaceAll("\\.", File.separator) + File.separator + byName + ".js";
		URL source = getClass().getClassLoader().getResource(resource);
		LanguageCompiler compiler = new LanguageCompiler(forLocale, defaultLocale, null);

		if (source == null) {
			return new HashMap<Object, Object>();
		}

		Properties properties = compiler.createProperties(source, sourceRoots);

		return properties;
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

	public void setSupportedLocales(List<Locale> supportedLocales) {
		this.supportedLocales = supportedLocales;
	}

	public void setDefaultLocale(Locale defaultLocale) {
		this.defaultLocale = defaultLocale;
	}

	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}

	public void setPagePackage(String pagePackage) {
		this.pagePackage = pagePackage;
	}
}
