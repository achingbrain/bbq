package org.bbqjs.spring.http.converter.json;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLDecoder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;

/**
 * Extends the MappingJacksonHttpMessageConverter to de-encode all Strings passed to the server
 * as JSON objects.
 * 
 * For example, the string " must be encoded to be part of a JSON object:
 * 
 * <code>
 * { foo: """ }
 * </code>
 * 
 * Would become:
 * 
 * <code>
 * { foo: "%22" }
 * </code>
 * 
 * This class automatically runs every String through URLDecoder#decode as part of mapping from JSON
 * to a POJO.
 * 
 * For this to work every string field must have a POJO style getter and setter method 
 * associated with it.  So, for example:
 * 
 * <code>
 * public class Foo {
 * 		private String bar;
 * 
 * 		public void setBar(String bar) {
 *			this.bar = bar; 
 * 		}
 * 
 * 		public String getBar() {
 * 			return bar;
 * 		}
 * }
 * </code>
 * 
 * @author alex
 */
public class UrlEncodedMappingJacksonHttpMessageConverter extends MappingJacksonHttpMessageConverter {
	private final Logger LOG = LoggerFactory.getLogger(UrlEncodedMappingJacksonHttpMessageConverter.class);
	
	@Override
	protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
		Object object = super.readInternal(clazz, inputMessage);
		
		deEncodeStrings(clazz, object);
		
		return object;
	}
	
	private void deEncodeStrings(Class<?> clazz, Object object) {
		// de-encode all fields declared by this class
		for(Field field : clazz.getDeclaredFields()) {
			if(!field.getType().equals(String.class)) {
				// only interested in String fields
				continue;
			}
			
			String camelisedFieldName = field.getName().substring(0, 1).toUpperCase() + field.getName().substring(1); 
			Method getter = null;
			Method setter = null;
			
			for(Method method : clazz.getMethods()) {
				if(method.getName().equals("get" + camelisedFieldName)) {
					getter = method;
				}
				
				if(method.getName().equals("set" + camelisedFieldName)) {
					setter = method;
				}
			}
			
			if(getter != null && setter != null) {
				// found getter and setter
				try {
					String value = (String)getter.invoke(object);
					
					// no need to decode nulls
					if(value != null) {
						// de-encode value
						value = URLDecoder.decode(value, "UTF-8");
					}
					
					setter.invoke(object, value);
				} catch(IllegalArgumentException e) {
					LOG.error("Caught exception while trying to de-encode " + field.getName(), e);
				} catch(IllegalAccessException e) {
					LOG.error("Caught exception while trying to de-encode " + field.getName(), e);
				} catch(InvocationTargetException e) {
					LOG.error("Caught exception while trying to de-encode " + field.getName(), e);
				} catch(UnsupportedEncodingException e) {
					LOG.error("Caught exception while trying to de-encode " + field.getName(), e);
				}
			}
		}
		
		// if this class is a subclass, de-encode the fields declared by the superclass
		if(clazz.getSuperclass() != null) {
			deEncodeStrings(clazz.getSuperclass(), object);
		}
	}
}
