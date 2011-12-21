package org.bbqjs.mojo;

import org.apache.maven.artifact.DependencyResolutionRequiredException;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;
import org.codehaus.plexus.classworlds.realm.ClassRealm;

import java.io.File;
import java.net.MalformedURLException;
import java.util.List;

/**
 * Allows a Maven plugin to access the classpath of the project
 */
public abstract class RuntimeClasspathAwareMojo extends AbstractMojo {

	protected MavenProject project;

	public void execute(MavenProject project, PluginDescriptor descriptor) throws MojoExecutionException, MojoFailureException {
		addProjectRuntimeClasspathToPluginClasspath(project, descriptor);
	}

	protected void addProjectRuntimeClasspathToPluginClasspath(MavenProject project, PluginDescriptor descriptor) throws MojoFailureException {
		try {
			addToPluginClasspath(descriptor, project.getRuntimeClasspathElements());
		} catch (DependencyResolutionRequiredException e) {
			throw new MojoFailureException("Could not add project classpath elements to plugin classpath elements", e);
		}
	}

	protected void addToPluginClasspath(PluginDescriptor descriptor, List<String> elements) throws MojoFailureException {
		try {
			ClassRealm realm = descriptor.getClassRealm();

			for (String element : elements) {
				File elementFile = new File(element);
				realm.addURL(elementFile.toURI().toURL());
			}
		} catch (MalformedURLException e) {
			throw new MojoFailureException("Could not add project classpath elements to plugin classpath elements", e);
		}
	}
}
