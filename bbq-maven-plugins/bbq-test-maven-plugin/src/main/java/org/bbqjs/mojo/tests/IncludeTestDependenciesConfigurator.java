package org.bbqjs.mojo.tests;

import org.bbqjs.mojo.IncludeDependenciesComponentConfigurator;
import org.codehaus.classworlds.ClassRealm;
import org.codehaus.plexus.component.configurator.ComponentConfigurationException;
import org.codehaus.plexus.component.configurator.ConfigurationListener;
import org.codehaus.plexus.component.configurator.expression.ExpressionEvaluator;
import org.codehaus.plexus.configuration.PlexusConfiguration;

/**
 * A custom ComponentConfigurator which adds the project's runtime classpath elements
 * to the plugin's classpath.
 *
 * Borrowed from http://maven.40175.n5.nabble.com/Adding-project-dependencies-and-generated-classes-to-classpath-of-my-plugin-td110119.html
 *
 * For some reason I have to be included in the same package as the plugin mojo otherwise the
 * comments get stripped out by the compiler so the commons-style annotations don't work.
 *
 * @author Brian Jackson
 * @since Aug 1, 2008 3:04:17 PM
 *
 * @plexus.component role="org.codehaus.plexus.component.configurator.ComponentConfigurator" role-hint="include-project-test-dependencies"
 * @plexus.requirement role="org.codehaus.plexus.component.configurator.converters.lookup.ConverterLookup" role-hint="default"
 */
public class IncludeTestDependenciesConfigurator extends IncludeDependenciesComponentConfigurator {

	public void configureComponent( Object component, PlexusConfiguration configuration, ExpressionEvaluator expressionEvaluator, ClassRealm containerRealm, ConfigurationListener listener ) throws ComponentConfigurationException {
		addProjectDependenciesToClassRealm("${project.runtimeClasspathElements}", expressionEvaluator, containerRealm);
		addProjectDependenciesToClassRealm("${project.testClasspathElements}", expressionEvaluator, containerRealm);

		super.configureComponent(component, configuration, expressionEvaluator, containerRealm, listener);
	}
}
