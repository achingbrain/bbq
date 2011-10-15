package org.bbqjs.compiler.javascript;

import org.bbqjs.compiler.AbstractCompiler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.util.*;

public class JavaScriptCompiler extends AbstractCompiler<CompilableJavaScriptFile> {
	private static Logger LOG = LoggerFactory.getLogger(JavaScriptCompiler.class);
	
	public static void setLogger(Logger log) {
		LOG = log;
	}
	
	private List<String> packages;
	private static final String ASSIGNER_WINDOW = " =";
	private static final String ASSIGNER_PROPERTY = ":";

	public JavaScriptCompiler(String[] libraries) {
		super(libraries);
	}
	
	@Override
	public void compile(URL inputFile, String packageName, OutputStream outputStream, String[] sourceRoots) throws IOException {
		packages = new ArrayList<String>();

		LOG.debug("Will compile " + inputFile);
		LOG.debug("PackageName " + packageName);
		LOG.debug("Input file " + inputFile);

		compileToOutputStream(new CompilableJavaScriptFile(inputFile, packageName, sourceRoots), outputStream);
	}

	@Override
	protected void afterWrittenLibrariesToOutputStream(List<CompilableJavaScriptFile> includedFiles, OutputStream outputStream) throws IOException {
		// write namespace into output stream
		for(CompilableJavaScriptFile included : includedFiles) {
			String packageName = included.getPackageName();
			
			if((packageName == null) || packageName.trim().equals("")) {
				continue;
			}
			
			packages.add(packageName);	
		}
		
		Map<String, Map<String, Object>> ns = new HashMap<String, Map<String, Object>>();
		
		for(String packageName : packages) {
			createNamespace(packageName, ns);
		}
		
		outputStream.write(("/* start namespace declaration */ \r\n").getBytes());
		
		writePackageNames(ns, 0, ASSIGNER_WINDOW, outputStream);
		
		outputStream.write(("\r\n\r\n/* end namespace declaration */ \r\n").getBytes());
	}
	
	/**
	 * Builds a tree representing all the package names used by the source file and the files
	 * it includes
	 * 
	 * @param packageName
	 * @param nameSpace
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected void createNamespace(String packageName, Map<String, Map<String, Object>> nameSpace) {
		String[] parts = packageName.split("\\.");
		
		if(parts.length == 0) {
			return;
		}
		
		String part = parts[0];
		
		Map ns = nameSpace.get(part);
		
		if(ns == null) {
			ns = new HashMap<String, Map<String, Object>>();
			nameSpace.put(part, ns);
		}
		
		if(parts.length == 1) {
			return;
		}
		
		createNamespace(packageName.substring((part + ".").length()), ns);
	}
	
	/**
	 * Prints the package tree out into the passed output stream
	 * 
	 * @param ns
	 * @param indentation
	 * @param assigner
	 * @param outputStream
	 * @throws IOException
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected void writePackageNames(Map<String, Map<String, Object>> ns, int indentation, String assigner, OutputStream outputStream) throws IOException {
		String indent = "";
		
		for(int i = 0; i < indentation; i++) {
				indent += "\t";
		}
		
		for(Iterator<String> iterator = ns.keySet().iterator(); iterator.hasNext();) {
			String key = iterator.next();
			String name = "\"" + key + "\"";
			
			if(assigner.equals(ASSIGNER_WINDOW)) {
				name = "window[" + name + "]";
			}
			
			outputStream.write(("\r\n" + indent + name + assigner + " {").getBytes());
			
			Map p = ns.get(key);
			
			writePackageNames(p, indentation + 1, ASSIGNER_PROPERTY, outputStream);
			
			outputStream.write(("\r\n" + indent + "}").getBytes());
			
			if(assigner.equals(ASSIGNER_WINDOW)) {
				outputStream.write((";").getBytes());
			} else if(iterator.hasNext()) {
				outputStream.write((",").getBytes());
			}
		}
	}
}
