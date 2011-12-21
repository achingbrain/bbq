package org.bbqjs.mojo;

import org.codehaus.classworlds.ClassRealm;
import org.codehaus.plexus.component.configurator.AbstractComponentConfigurator;
import org.codehaus.plexus.component.configurator.ComponentConfigurationException;
import org.codehaus.plexus.component.configurator.ConfigurationListener;
import org.codehaus.plexus.component.configurator.converters.composite.ObjectWithFieldsConverter;
import org.codehaus.plexus.component.configurator.converters.special.ClassRealmConverter;
import org.codehaus.plexus.component.configurator.expression.ExpressionEvaluationException;
import org.codehaus.plexus.component.configurator.expression.ExpressionEvaluator;
import org.codehaus.plexus.configuration.PlexusConfiguration;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public abstract class IncludeDependenciesComponentConfigurator extends AbstractComponentConfigurator {
	public void configureComponent( Object component, PlexusConfiguration configuration, ExpressionEvaluator expressionEvaluator, ClassRealm containerRealm, ConfigurationListener listener ) throws ComponentConfigurationException {
		converterLookup.registerConverter( new ClassRealmConverter( containerRealm ) );

		ObjectWithFieldsConverter converter = new ObjectWithFieldsConverter();

		converter.processConfiguration( converterLookup, component, containerRealm.getClassLoader(), configuration, expressionEvaluator, listener );
	}

	protected void addProjectDependenciesToClassRealm(String expression, ExpressionEvaluator expressionEvaluator, ClassRealm containerRealm) throws ComponentConfigurationException {
		List<String> runtimeClasspathElements;

		try {
			//noinspection unchecked
			runtimeClasspathElements = (List<String>) expressionEvaluator.evaluate(expression);
		} catch (ExpressionEvaluationException e) {
			throw new ComponentConfigurationException("There was a problem evaluating: " + expression, e);
		}

		// Add the project dependencies to the ClassRealm
		final URL[] urls = buildURLs(runtimeClasspathElements);
		for (URL url : urls) {
			containerRealm.addConstituent(url);
		}
	}

	private URL[] buildURLs(List<String> runtimeClasspathElements) throws ComponentConfigurationException {
		// Add the projects classes and dependencies
		List<URL> urls = new ArrayList<URL>(runtimeClasspathElements.size());

		for (String element : runtimeClasspathElements) {
			try {
				URL url = new File(element).toURI().toURL();
				urls.add(url);
			} catch (MalformedURLException e) {
				throw new ComponentConfigurationException("Unable to access project dependency: " + element, e);
			}
		}

		// Add the plugin's dependencies
		return urls.toArray(new URL[urls.size()]);
	}
}
