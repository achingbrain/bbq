package org.bbqjs.mojo;

import org.apache.maven.artifact.DependencyResolutionRequiredException;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.descriptor.PluginDescriptor;
import org.apache.maven.project.MavenProject;

/**
 * Allows a Maven plugin to access the test classpath of the project
 */
public abstract class TestClasspathAwareMojo extends RuntimeClasspathAwareMojo {

	public void execute(MavenProject project, PluginDescriptor descriptor) throws MojoExecutionException, MojoFailureException {
		super.execute(project, descriptor);

		addProjectTestClasspathToPluginClasspath(project, descriptor);
	}

	protected void addProjectTestClasspathToPluginClasspath(MavenProject project, PluginDescriptor descriptor) throws MojoFailureException {
		try {
			addToPluginClasspath(descriptor, project.getTestClasspathElements());
		} catch (DependencyResolutionRequiredException e) {
			throw new MojoFailureException("Could not add project classpath elements to plugin classpath elements", e);
		}
	}
}
