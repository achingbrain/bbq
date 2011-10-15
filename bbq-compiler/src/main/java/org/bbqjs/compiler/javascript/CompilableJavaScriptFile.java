package org.bbqjs.compiler.javascript;

import org.bbqjs.compiler.AbstractCompilableFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URL;

public class CompilableJavaScriptFile extends AbstractCompilableFile {
	private static Logger LOG = LoggerFactory.getLogger(CompilableJavaScriptFile.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private String packageName;
	
	public CompilableJavaScriptFile(URL javaScriptInputFile, String packageName, String[] sourceRoots) throws IOException {
		super(javaScriptInputFile, sourceRoots);
		
		this.packageName = packageName;
		
		findIncludes(javaScriptInputFile);
	}
	
	@Override
	protected void encounteredInclude(String className, URL javaScriptFile) throws IOException {
		StringBuilder packageName = new StringBuilder();
		String[] parts = className.split("\\.");
		
		for(int i = 0; i < parts.length -1; i++) {
			packageName.append(parts[i]);
			
			if(i < parts.length - 2) {
				packageName.append(".");
			}
		}
		
		LOG.debug("Including file " + javaScriptFile);
		
		includedFiles.add(new CompilableJavaScriptFile(javaScriptFile, packageName.toString(), sourceRoots));
	}
	
	public String getPackageName() {
		return packageName == null ? "" : packageName.toString();
	}
}
