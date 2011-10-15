package org.bbqjs.mojo;

import org.apache.maven.artifact.DependencyResolutionRequiredException;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;

/**
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 13/08/2011
 * Time: 18:59
 * To change this template use File | Settings | File Templates.
 */
public abstract class TestClasspathAwareMojo extends RuntimeClasspathAwareMojo {

	public void execute() throws MojoExecutionException, MojoFailureException {
		super.execute();

		addProjectTestClasspathToPluginClasspath();
	}
	
	protected void addProjectTestClasspathToPluginClasspath() throws MojoFailureException {
		try {
			addToPluginClasspath(project.getTestClasspathElements());
		} catch (DependencyResolutionRequiredException e) {
			throw new MojoFailureException("Could not add project classpath elements to plugin classpath elements", e);
		}
	}
}
