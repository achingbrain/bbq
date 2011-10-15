package org.bbqjs.spring.debug;

import java.io.File;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.bbqjs.compiler.Compiler;
import org.bbqjs.compiler.css.CSSCompiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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

	public void setTheme(String theme) {
		this.theme = theme;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public void setIncludes(String[] includes) {
		this.includes = includes;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public void setPagePackage(String pagePackage) {
		this.pagePackage = pagePackage;
	}

	public void setSourceRoots(String[] sourceRoots) {
		this.sourceRoots = sourceRoots;
	}
}
