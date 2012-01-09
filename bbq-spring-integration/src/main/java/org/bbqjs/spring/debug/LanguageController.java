package org.bbqjs.spring.debug;

import org.bbqjs.compiler.language.LanguageCompiler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.net.URL;
import java.util.*;

/**
 * A version of the LanguageController meant for development.  Attempts to dynamically
 * create the language file for every request - not recommended for production.
 *
 * Sample Spring configuration:
 *
 * <pre><code class="language-xml">
 * &lt;bean id="languageController" class="org.bbqjs.spring.debug.LanguageController"&gt;
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
 */
@Controller
public class LanguageController {
	private List<Locale> supportedLocales;
	private Locale defaultLocale;
	private String[] sourceRoots;
	private String pagePackage;

	/**
	 * The controller method.
	 * @param request
	 * @param locale
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/language/get", method = RequestMethod.POST)
	public @ResponseBody Map<Object, Object> getLanguage(@RequestBody LanguageRequest request, Locale locale) throws IOException {
		if (!supportedLocales.contains(locale)) {
			locale = defaultLocale;
		}

		return getLanguageFile(request.getSection(), locale);
	}

	/**
	 * Compiles and returns a language translation section.
	 * @param byName
	 * @param forLocale
	 * @return
	 * @throws IOException
	 */
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

	/**
	 * This class is used to request a given language translation file
	 */
	public static class LanguageRequest implements Serializable {
		private static final long serialVersionUID = 2889445903996689890L;
		private String section;

		/**
		 * The section is the name of the JavaScript class for the current page - ie. Home or Contact, etc
		 * @return
		 */
		public String getSection() {
			return section;
		}

		public void setSection(String section) {
			this.section = section;
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

	/**
	 * Where to look for language files - a suggested value is "src/main/javascript".
	 * @param sourceRoots
	 */
	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}

	/**
	 * The ${js.page.package} from your pom.  Maven should replace this at run/compile time.
	 * @param pagePackage
	 */
	public void setPagePackage(String pagePackage) {
		this.pagePackage = pagePackage;
	}
}
