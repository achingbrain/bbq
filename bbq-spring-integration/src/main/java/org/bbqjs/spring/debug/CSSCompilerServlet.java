package org.bbqjs.spring.debug;

import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.css.CSSCompiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.net.URL;

/**
 * Dynamically creates the CSS file with every request - meant for development and not recommended for production.
 *
 * Spring configuration example:
 *
 * <pre><code class="language-xml">
 * &lt;bean id="cssController" class="org.bbqjs.spring.debug.CSSCompilerServlet"&gt;
 *     &lt;property name="pagePackage" value="${js.page.package}"/&gt;
 *     &lt;property name="path" value="/css"/&gt;
 *     &lt;property name="extension" value="less"/&gt;
 *     &lt;property name="includes"&gt;
 *         &lt;list&gt;
 *             &lt;value&gt;boilerplate.less&lt;/value&gt;
 *             &lt;value&gt;common.less&lt;/value&gt;
 *         &lt;/list&gt;
 *     &lt;/property&gt;
 *     &lt;property name="sourceRoots"&gt;
 *         &lt;list&gt;
 *             &lt;value&gt;src/main/css&lt;/value&gt;
 *         &lt;/list&gt;
 *     &lt;/property&gt;
 * &lt;/bean&gt;
 * </code></pre>
 *
 * The above example will respond to requests such as <code>/css/generated/Home.less</code>.
 */
@Controller
public class CSSCompilerServlet {
	private static final Logger LOG = LoggerFactory.getLogger(CSSCompilerServlet.class);

	// can be null
	private String theme;

	private String extension = "css";

	// default file locations
	private String path = "/css";
	private String[] includes;
	private String pagePackage;
	private String[] sourceRoots;

	/**
	 * The controller method.
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(method = {RequestMethod.POST, RequestMethod.GET})
	public void compileFile(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.setContentType("text/css");
		
		String requestURI = request.getRequestURI();
		requestURI = requestURI.replaceAll(path, "");
		requestURI = requestURI.replace("." + extension, ".js");
		String resource = pagePackage.replaceAll("\\.", File.separator) + requestURI;

		URL url = getClass().getClassLoader().getResource(resource);

		if (url == null) {
			LOG.error("Could not load file for " + resource);

			response.sendError(404);

			return;
		}

		Compiler compiler = new CSSCompiler(theme, includes);
		compiler.compile(url, pagePackage, response.getOutputStream(), sourceRoots);
	}

	/**
	 * If a theme is used, pass in the name of the theme here.
	 * @param theme
	 */
	public void setTheme(String theme) {
		this.theme = theme;
	}

	/**
	 * This is the mount path of the controller.  It is used to locate the relevant css document.
	 *
	 * If you send request to http://www.example.org/css/Home.css, this field should have the value "/css"
	 * @param path
	 */
	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * Specify any arbitrary files you want included at the top of the stylesheet.
	 * @param includes
	 */
	public void setIncludes(String[] includes) {
		this.includes = includes;
	}

	/**
	 * This is the requested file extension - defaults to css.  If you request http://www.example.org/css/Home.less, this should be set to "less"
	 * @param extension
	 */
	public void setExtension(String extension) {
		this.extension = extension;
	}

	/**
	 * The ${js.page.package} from your pom.  Maven should replace this at run/compile time.
	 * @param pagePackage
	 */
	public void setPagePackage(String pagePackage) {
		this.pagePackage = pagePackage;
	}

	/**
	 * Where to look for CSS files - a suggested value is "src/main/css".
	 * @param sourceRoots
	 */
	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}
}
