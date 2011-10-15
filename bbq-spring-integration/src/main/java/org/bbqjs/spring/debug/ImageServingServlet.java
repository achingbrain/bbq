package org.bbqjs.spring.debug;

import org.apache.commons.io.IOUtils;
import org.bbqjs.compiler.javascript.JavaScriptCompiler;
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
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 15/08/2011
 * Time: 14:13
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class ImageServingServlet implements ServletContextAware {
	private static final Logger LOG = LoggerFactory.getLogger(JavaScriptCompilerServlet.class);

	// default location
	private String path = "/images";
	private String[] sourceRoots;
	private ServletContext servletContext;

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

	public void setPath(String path) {
		this.path = path;
	}

	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}
}
