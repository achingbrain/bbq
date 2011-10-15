package org.bbqjs.compiler.language;

import java.io.IOException;
import java.util.Properties;

public interface LanguageFile {
	public Properties getLanguageTranslations() throws IOException;
}
