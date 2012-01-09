package org.bbqjs.spring.debug;

import org.apache.commons.io.IOUtils;
import org.bbqjs.compiler.util.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.net.URL;

/**
 * Serves images out of one or more directories on the classpath.  The intention is you set sourceRoots to
 * include the src/main/css directory as well as src/main/webapps/images in order to serve resources
 * while in development which would normally be copied into the target folder by the bbq-resources-maven-plugin.
 *
 * Not meant to be used in production.
 *
 * Example Spring configuration:
 *
 * <pre><code class="language-xml">
 * &lt;bean id="imageController" class="org.bbqjs.spring.debug.ImageServingServlet"&gt;
 *     &lt;property name="path" value="/images" /&gt;
 *     &lt;property name="sourceRoots"&gt;
 *         &lt;list&gt;
 *             &lt;value&gt;src/main/css&lt;/value&gt;
 *             &lt;value&gt;src/main/webapp/images&lt;/value&gt;
 *         &lt;/list&gt;
 *     &lt;/property&gt;
 * &lt;/bean&gt;
 * </code></pre>
 */
@Controller
public class ImageServingServlet implements ServletContextAware {
	private static final Logger LOG = LoggerFactory.getLogger(JavaScriptCompilerServlet.class);

	// default location
	private String path = "/images";
	private String[] sourceRoots;
	private ServletContext servletContext;

	/**
	 * The controller method.  Receives urls such as http://www.example.org/images/foo/bar.gif,
	 * turns it into /foo/bar.gif and searches the sourceRoots for the requested image, serving it
	 * if found.
	 *
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(method = {RequestMethod.POST, RequestMethod.GET})
	public void serveImage(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String requestURI = request.getRequestURI();
		String resource = requestURI.replaceAll(path, "");

		URL url = Utils.findFile(resource, sourceRoots);

		if(url == null) {
			LOG.error("Could not load file for " + resource);

			response.sendError(404);

			return;
		}

		File file = new File(url.getFile());

		if(!file.exists()) {
			LOG.error("Could not load file for " + resource);

			response.sendError(404);

			return;
		}

		String mimeType = servletContext.getMimeType(file.getName());
		MediaType mediaType = (StringUtils.hasText(mimeType) ? MediaType.parseMediaType(mimeType) : null);

		response.setContentLength((int)file.length());
		response.setContentType(mediaType.toString());

		IOUtils.copy(url.openStream(), response.getOutputStream());
	}

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	/**
	 * If this controller listens on http://www.example.org/images, this should be set to "/images"
	 * @param path
	 */
	public void setPath(String path) {
		this.path = path;
	}

	/**
	 * Where to load images from.  Suggested values are <code>src/main/css</code> and <code>src/main/webapp/images</code>
	 * @param sourceRoots
	 */
	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}
}
