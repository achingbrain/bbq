package org.bbqjs.spring.mvc;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PageController {
	private String view;
	private Map<String, Object> model = new HashMap<String, Object>();
	
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView handlePostRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ModelAndView modelAndView = new ModelAndView(getView());
		modelAndView.addAllObjects(getModel());
		
		return modelAndView;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView handleGetRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return handlePostRequest(request, response);
	}
	
	public String getView() {
		return view;
	}
	
	public void setView(String view) {
		this.view = view;
	}
	
	public Map<String, Object> getModel() {
		return model;
	}
	
	public void setModel(Map<String, Object> model) {
		this.model = model;
	}
}