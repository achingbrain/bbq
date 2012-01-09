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
 * Serves maps of language files.  This is the non-debug version of org.bbqjs.spring.debug.LanguageController
 *
 * Language files are Java properties files stored under /WEB-INF/language (overrideable by setting the
 * languageFilesLocation property).  This class looks up the appropriate file and serves it if available.
 *
 * Sample Spring configuration:
 *
 * <pre><code class="language-xml">
 * &lt;bean id="languageController" class="org.bbqjs.spring.mvc.LanguageController"&gt;
 *     &lt;property name="defaultLocale" value="en_GB"/&gt;
 *     &lt;property name="supportedLocales"&gt;
 *         &lt;list&gt;
 *             &lt;value&gt;en_GB&lt;/value&gt;
 *             &lt;value&gt;en_US&lt;/value&gt;
 *         &lt;/list&gt;
 *     &lt;/property&gt;
 *     &lt;property name="pagePackage" value="${js.page.package}"/&gt;
 *     &lt;property name="sourceRoots"&gt;
 *         &lt;list&gt;
 *             &lt;value&gt;src/main/javascript&lt;/value&gt;
 *         &lt;/list&gt;
 *     &lt;/property&gt;
 * &lt;/bean&gt;
 * </pre></code>
 *
 * @see org.bbqjs.spring.debug.LanguageController
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

	/**
	 * @inheritdoc
	 * @param servletContext
	 */
	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	/**
	 * Set this to override where in your application the language files are stored (defaults to /WEB-INF/language)
	 * @param languageFilesLocation
	 */
	public void setLanguageFilesLocation(String languageFilesLocation) {
		this.languageFilesLocation = languageFilesLocation;

		if(!this.languageFilesLocation.endsWith(File.separator)) {
			this.languageFilesLocation += File.separator;
		}
	}

	/**
	 * A list of locales that your application supports.
	 * @param supportedLocales
	 */
	public void setSupportedLocales(List<Locale> supportedLocales) {
		this.supportedLocales = supportedLocales;
	}

	/**
	 * When no language translation exists for a given term, fall back to this locale.
	 * @param defaultLocale
	 */
	public void setDefaultLocale(Locale defaultLocale) {
		this.defaultLocale = defaultLocale;
	}
}
