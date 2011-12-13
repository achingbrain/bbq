#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.spring.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/backend/aRequest/*")
public class MyController {
	
	@RequestMapping(method=RequestMethod.POST)
	public @ResponseBody MyResponse doSomething(@RequestBody MyRequest request) {
		MyResponse myResponse = new MyResponse();
		myResponse.setBar(request.getFoo());
		
		return myResponse;
	}
}
