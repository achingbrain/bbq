package org.bbqjs.compiler.language.check;

import java.io.File;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.bbqjs.compiler.util.Utils;


public class CompiledJavaScriptFile {
	private String name;
	private String contents;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getContents() {
		return contents;
	}
	
	public void setContents(String contents) {
		this.contents = contents;
	}
	
	public CompiledJavaScriptFile() {
		
	}
	
	public void setFile(File file) {
		name = file.getName();
		contents = Utils.getFileContents(file);
	}

	public void setFile(URL file) {
		String[] pathComponents = file.toString().split("/");

		name = pathComponents[pathComponents.length - 1];
		contents = Utils.getFileContents(file);
	}
	
	public CompiledJavaScriptFile(File file) {
		setFile(file);
	}
	
	public boolean contains(String key) {
		return occurrencesOf(key) > 0;
	}
	
	public int occurrencesOf(String key) {
		String regex = "Language.get[a-zA-Z]*\\(\"" + key.replaceAll("\\.", "\\\\.");
		
		Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);
		Matcher matcher = pattern.matcher(contents);
		
		int count = 0;
		
		while(matcher.find()) {
			count++;
		}
		
		return count;
	}
	
	public boolean containsArray(String key) {
		String regex = "Language.getArray\\(\"" + getArrayString(key).replaceAll("\\.", "\\\\.");
		
		Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);
		Matcher matcher = pattern.matcher(contents);
		
		while(matcher.find()) {
			return true;
		}
		
		return false;
	}
	
	protected String getArrayString(String string) {
		String output = string;
		
		for(int i = string.length() - 1; i > 0; i--) {
			try {
				Integer.parseInt(string.substring(i, string.length()));
				
				output = output.substring(0, i);
			} catch(NumberFormatException e) {
				return output;
			}
		}
		
		return string;
	}
}
