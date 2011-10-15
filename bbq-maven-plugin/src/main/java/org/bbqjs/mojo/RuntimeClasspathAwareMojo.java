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
 * Created by IntelliJ IDEA.
 * User: alex
 * Date: 13/08/2011
 * Time: 16:21
 * To change this template use File | Settings | File Templates.
 */
public abstract class RuntimeClasspathAwareMojo extends AbstractMojo {

	/**
	 * @parameter expression="${project}"
	 * @required
	 * @readonly
	 */
	protected MavenProject project;

	/**
	 * Plugin descriptor.
	 *
	 * @parameter default-value="${plugin}"
	 * @required
	 * @readonly
	 */
	protected PluginDescriptor descriptor;

	public void execute() throws MojoExecutionException, MojoFailureException {
		addProjectRuntimeClasspathToPluginClasspath();
	}

	protected void addProjectRuntimeClasspathToPluginClasspath() throws MojoFailureException {
		try {
			addToPluginClasspath(project.getRuntimeClasspathElements());
		} catch (DependencyResolutionRequiredException e) {
			throw new MojoFailureException("Could not add project classpath elements to plugin classpath elements", e);
		}
	}

	protected void addToPluginClasspath(List<String> elements) throws MojoFailureException {
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

	public void setProject(MavenProject project) {
		this.project = project;
	}

	public void setDescriptor(PluginDescriptor descriptor) {
		this.descriptor = descriptor;
	}
}
