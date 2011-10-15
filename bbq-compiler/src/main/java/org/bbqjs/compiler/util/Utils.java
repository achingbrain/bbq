package org.bbqjs.compiler.util;

import org.apache.commons.io.IOUtils;

import java.io.*;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

public class Utils {
	public static String getFileContents(String path) {
		return getFileContents(new File(path));
	}
	
	public static String getFileContents(File file) {
		try {
			return getFileContents(new FileInputStream(file));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

		return null;
	}

	public static String getFileContents(URL file) {
		try {
			return getFileContents(file.openStream());
		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;
	}

	public static String getFileContents(InputStream file) {
		StringWriter writer = new StringWriter();

		try {
			IOUtils.copy(file, writer);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return writer.toString();
	}
	
	public static String fileNameWithoutExtension(File file) {
		String fileName = file.getName();
		int index = file.getName().lastIndexOf(".");
		
		return fileName.substring(0, index);
	}
	
	public static String getJavaScriptClassName(URL javaScriptInputFile, String jsDirectory) {
		String[] pathComponents = javaScriptInputFile.toString().split("/");
		String className = pathComponents[pathComponents.length - 1];
		className = className.replaceAll(File.separator, ".");
		className = className.replace(".js", "");
		
		if(className.endsWith(".js")) {
			className = className.substring(0, className.length() - 3);
		}
		
		return className;
	}

	public static URL findFile(String path, String[] sourceRoots) throws IOException {
		if(sourceRoots == null) {
			sourceRoots = new String[0];
		}

		for(String sourceRoot : sourceRoots) {
			URL url = findFileFromFile(path, sourceRoot);

			if(url != null) {
				return url;
			}
		}

		return findFileOnClassPath(path);
	}

	public static URL findFile(String path, String sourceRoot) throws IOException {
		// try to load from the source root first
		URL url = findFileFromFile(path, sourceRoot);

		if (url == null) {
			// otherwise try the classpath
			url = findFileOnClassPath(path);
		}

		return url;
	}

	public static URL findFile(String path, String sourceRoot, Locale locale, String extension) throws IOException {
		// try foo.en_GB.lang.xml
		URL url = findFile(path + "." + locale + "." + extension, sourceRoot);

		if(url != null) {
			return url;
		}

		// try foo.en.lang.xml
		url = findFile(path + "." + locale.getLanguage() + "." + extension, sourceRoot);

		if(url != null) {
			return url;
		}

		return null;
	}

	public static URL findFileOnClassPath(String path) throws IOException {
		return Utils.class.getClassLoader().getResource(path);
	}

	public static URL findFileFromFile(String path, String sourceRoot) throws IOException {
		File file = new File(sourceRoot + File.separator + path);

		if (file.exists()) {
			return file.toURI().toURL();
		}

		file = new File(path);

		if (file.exists()) {
			return file.toURI().toURL();
		}

		return null;
	}
}
