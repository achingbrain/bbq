package org.bbqjs.spring.mvc;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * Maps exceptions to error codes.
 * 
 * Set the errorCodes map to do custom error mapping.
 * 
 * @author alex
 */
public class ErrorController implements HandlerExceptionResolver {
	private final static Logger LOG = LoggerFactory.getLogger(ErrorController.class);
	
	/**
	 * Default error code.
	 */
	public static final int EPIC_FAIL_CODE = -100;
	public static final String X_BBQ_RESPONSE_TYPE ="X-BBQ-ResponseType";
	public static final String X_BBQ_RESPONSE_MESSAGE = "X-BBQ-ResponseMessage";
	
	/**
	 * If the error header (e.g. stack trace) is too long, web containers tend to get unhappy so
	 * we truncate it to this length.
	 */
	private static final int MAX_HEADER_LENGTH = 3072;

	private Map<Class<?>, Integer>errorCodes = Collections.emptyMap();
	private Map<Class<?>, String> errorViews = Collections.emptyMap();
	private String defaultErrorView = "error";

	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) {
		try {
			encounteredError(request, response, exception);

			ModelAndView modelAndView = getModelAndView(exception);

			if(modelAndView.getViewName().startsWith("redirect:")) {
				// do not add values to redirect view as if they are too long
				// some web containers baulk at the variable length

				return modelAndView;
			}

			String message = getErrorMessage(exception);
			int code = getErrorCode(exception);

			// -100 triggers epic fail message in front end
			response.addIntHeader(X_BBQ_RESPONSE_TYPE, code);
			response.addHeader(X_BBQ_RESPONSE_MESSAGE, message);

			response.setStatus(HttpServletResponse.SC_OK);

			modelAndView.addObject("error", message);
			modelAndView.addObject("exception", exception);

			return modelAndView;
		} catch (Exception e) {
			LOG.error("Exception encountered while resolving exception.  That's a bit annoying.", e);
		}

		return null;
	}

	/**
	 * Override this to do logging, etc
	 * @param exception
	 */
	protected void encounteredError(HttpServletRequest request, HttpServletResponse response, Exception exception) {

	}

	protected String getErrorMessage(Exception exception) throws UnsupportedEncodingException {
		String message = exception.getMessage() + "\r\n\r\n";

		for (StackTraceElement trace : exception.getStackTrace()) {
			String line = trace.toString();

			message += line + "\r\n";
		}

		message = URLEncoder.encode(message, "UTF-8");

		if (message.length() > (MAX_HEADER_LENGTH + 3)) {
			message = message.substring(0, MAX_HEADER_LENGTH) + "...";
		}

		return message;
	}

	protected int getErrorCode(Exception exception) {
		Integer code = errorCodes.get(exception.getClass());

		if(code != null) {
			// looks like we knew about this kind of exception so only put
			// the stack trace in the debug log
			LOG.debug("Exception encountered", exception);

			return code;
		}

		// didn't have a mapping for this exception, might be serious so
		// vomit a stack trace into the log
		LOG.error("Exception encountered", exception);

		return EPIC_FAIL_CODE;
	}

	protected ModelAndView getModelAndView(Exception forException) {
		ModelAndView modelAndView;

		if (errorViews.containsKey(forException.getClass())) {
			modelAndView = new ModelAndView(errorViews.get(forException.getClass()));
		} else {
			modelAndView = new ModelAndView(defaultErrorView);
		}

		return modelAndView;
	}

	public void setErrorCodes(Map<Class<?>, Integer> errorCodes) {
		if(errorCodes == null) {
			errorCodes = Collections.emptyMap();
		}

		this.errorCodes = errorCodes;
	}

	/**
	 * A list of view template names keyed by exception class.  The list will be consulted and the
	 * exception-specific view name returned if available.
	 * @param errorViews
	 */
	public void setErrorViews(Map<Class<?>, String> errorViews) {
		this.errorViews = errorViews;
	}

	/**
	 * The name of the default view which is returned if ErrorController#errorViews doesn't contain a specific
	 * view for the thrown exception.
	 * @param defaultErrorView
	 */
	public void setDefaultErrorView(String defaultErrorView) {
		this.defaultErrorView = defaultErrorView;
	}
}
