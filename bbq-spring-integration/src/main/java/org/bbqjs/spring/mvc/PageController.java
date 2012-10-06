package org.bbqjs.spring.mvc;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * This is a boiler plate Controller which allows you to set a view name and values to pass to the model.
 * Using this means you don't have to declare such a dull class in your own code base.
 */
@Controller
public class PageController {
	private String view;
	private Map<String, Object> model = new HashMap<String, Object>();

	/**
	 * Controller method
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView handlePostRequest() throws Exception {
		ModelAndView modelAndView = new ModelAndView(getView());
		modelAndView.addAllObjects(getModel());

		return modelAndView;
	}

	/**
	 * Controller method
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView handleGetRequest() throws Exception {
		return handlePostRequest();
	}

	/**
	 * Returns the name of the view class this controller will use.
	 * @return
	 */
	public String getView() {
		return view;
	}

	/**
	 * Sets the name of the view class this controller will use.
	 * @param view
	 */
	public void setView(String view) {
		this.view = view;
	}

	/**
	 * Returns a map of key/value pairs that will be added to the page's model.
	 * @return
	 */
	public Map<String, Object> getModel() {
		return model;
	}

	/**
	 * Sets a map of key/value pairs that will be added to the page's model.
	 * @param model
	 */
	public void setModel(Map<String, Object> model) {
		this.model = model;
	}
}
